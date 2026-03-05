  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import './Register.css';
  import freeFireImage from '../assets/image/intro-image-card/free_fire-intro.jpg';
  import pubgImage from '../assets/image/intro-image-card/pubg-intro.jpg';
  import codImage from '../assets/image/intro-image-card/call of duty-intro.webp';
  import valorantImage from '../assets/image/intro-image-card/valorant-intro.webp';
  import freeFireLogo from '../assets/image/gamming-logo/Free-fire-logo.png';

  type GameType = 'freefire' | 'pubg' | 'cod' | 'valorant' | null;

  interface RegistrationForm {
    playerName: string;
    email: string;
    password: string;
    phone: string;
    promocode: string;
    leaderAddress: string;
    teamName: string;
    gameId: string;
    player2Name: string;
    player2GameId: string;
    player3Name: string;
    player3GameId: string;
    player4Name: string;
    player4GameId: string;
    player5Name: string;
    player5GameId: string;
  }

  interface GameData {
    id: GameType;
    name: string;
    icon: string;
    description: string;
    teamSizes: string[];
    color: string;
    lightColor: string;
    imagePath: string;
    rgbColor: string;
    disabled?: boolean;
  }

  const Register = () => {
    const navigate = useNavigate();
    const [selectedGame, setSelectedGame] = useState<GameType>(null);
    const [formData, setFormData] = useState<RegistrationForm>({
      playerName: '',
      email: '',
      password: '',
      phone: '',
      promocode: '',
      leaderAddress: '',
      teamName: '',
      gameId: '',
      player2Name: '',
      player2GameId: '',
      player3Name: '',
      player3GameId: '',
      player4Name: '',
      player4GameId: '',
      player5Name: '',
      player5GameId: ''
    });

    const games: GameData[] = [
      {
        id: 'freefire',
        name: 'Free Fire',
        icon: freeFireLogo,
        description: 'Clash Squad - 50 Players',
        teamSizes: ['Solo', 'Duo', 'Squad (4)'],
        color: '#ff6b6b',
        lightColor: '#ff8b8b',
        rgbColor: '255, 107, 107',
        imagePath: freeFireImage,
        disabled: false
      },
      {
        id: 'pubg',
        name: 'PUBG Mobile',
        icon: '🎯',
        description: '100-Player Showdowns',
        teamSizes: ['Solo', 'Duo', 'Squad (4)'],
        color: '#ff8e53',
        lightColor: '#ffab7a',
        rgbColor: '255, 142, 83',
        imagePath: pubgImage,
        disabled: true
      },
      {
        id: 'cod',
        name: 'Call of Duty',
        icon: '⚔️',
        description: 'Tactical Team Warfare',
        teamSizes: ['Solo', '2v2', '5v5'],
        color: '#a55eea',
        lightColor: '#c37fff',
        rgbColor: '165, 94, 234',
        imagePath: codImage,
        disabled: true
      },
      {
        id: 'valorant',
        name: 'Valorant',
        icon: '💎',
        description: '5v5 Tactical Shooter',
        teamSizes: ['5v5 Team'],
        color: '#00b894',
        lightColor: '#1dd1a1',
        rgbColor: '0, 184, 148',
        imagePath: valorantImage,
        disabled: true
      }
    ];

    const handleGameSelect = (gameId: GameType) => {
      setSelectedGame(gameId);
      setFormData({
        playerName: '',
        email: '',
        password: '',
        phone: '',
        promocode: '',
        leaderAddress: '',
        teamName: '',
        gameId: '',
        player2Name: '',
        player2GameId: '',
        player3Name: '',
        player3GameId: '',
        player4Name: '',
        player4GameId: '',
        player5Name: '',
        player5GameId: ''
      });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // Pass all registration data to payment page
      // Backend registration will happen after successful payment
      navigate('/payment', { state: {
        playerName: formData.playerName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        promocode: formData.promocode,
        leaderAddress: formData.leaderAddress,
        game: selectedGame,
        gameId: formData.gameId,
        teamName: formData.teamName,
        player2Name: formData.player2Name,
        player2GameId: formData.player2GameId,
        player3Name: formData.player3Name,
        player3GameId: formData.player3GameId,
        player4Name: formData.player4Name,
        player4GameId: formData.player4GameId,
        player5Name: formData.player5Name,
        player5GameId: formData.player5GameId
      } });
    };

    const handleBack = () => {
      setSelectedGame(null);
    };

    const selectedGameData = games.find(g => g.id === selectedGame);

    return (
      <div className="register-page">
        <div className="register-container">
          <button className="btn-home-nav" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          
          <h1 className="register-title">
            <span className="gradient-text">Game Registration</span>
          </h1>
          <p className="register-subtitle">
            Choose your game and join the competition
          </p>

          {!selectedGame ? (
            // Game Selection View
            <div className="game-selection">
              <div className="games-selection-grid">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className={`game-selection-card ${game.disabled ? 'disabled' : ''}`}
                    onClick={() => !game.disabled && handleGameSelect(game.id as GameType)}
                    style={{
                      backgroundImage: `url('${game.imagePath}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      '--game-color': game.color,
                      '--game-color-light': game.lightColor,
                      '--game-rgb': game.rgbColor
                    } as React.CSSProperties & {
                      '--game-color': string;
                      '--game-color-light': string;
                      '--game-rgb': string;
                    }}
                  >
                    <div className="game-selection-icon">
                      {typeof game.icon === 'string' && !game.icon.includes('/') ? (
                        game.icon
                      ) : (
                        <img src={game.icon} alt={game.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      )}
                    </div>
                    <h3>{game.name}</h3>
                    <p>{game.description}</p>
                    {game.disabled && <div className="coming-soon">COMING SOON</div>}
                    <button
                      className="btn btn-select"
                      style={{ 
                        background: `linear-gradient(45deg, ${game.color}, ${game.lightColor})`,
                        boxShadow: `0 0 20px ${game.color}`
                      }}
                      disabled={game.disabled}
                    >
                      {game.disabled ? 'Coming Soon' : 'Select Game'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Registration Form View
            <div className="registration-form-container">
              <div className="selected-game-header">
                <button className="btn-back" onClick={handleBack}>
                  ← Back to Games
                </button>
              </div>

              <form className="registration-form" onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3 className="form-section-title">Personal Information</h3>
                  
                  <div className="form-group">
                    <label htmlFor="playerName">Team Leader Name *</label>
                    <input
                      type="text"
                      id="playerName"
                      name="playerName"
                      value={formData.playerName}
                      onChange={handleInputChange}
                      placeholder="Enter your Real name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">WhatsApp Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="promocode">Promo Code (Optional)</label>
                    <input
                      type="text"
                      id="promocode"
                      name="promocode"
                      value={formData.promocode}
                      onChange={handleInputChange}
                      placeholder="Enter promo code"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="leaderAddress">Leader Address *</label>
                    <input
                      type="text"
                      id="leaderAddress"
                      name="leaderAddress"
                      value={formData.leaderAddress}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gameId">Leader Free Fire Game ID *</label>
                    <input
                      type="text"
                      id="gameId"
                      name="gameId"
                      value={formData.gameId}
                      onChange={handleInputChange}
                      placeholder="Enter Free Fire game ID"
                      required
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Team Information</h3>
                  
                  <div className="form-group">
                    <label htmlFor="teamName">Team Name *</label>
                    <input
                      type="text"
                      id="teamName"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      placeholder="Enter your team name"
                      required
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Other 4 Players Information</h3>
                  
                  <div className="form-row-two-col">
                    <div className="form-group">
                      <label htmlFor="player2Name">Player 2 Name *</label>
                      <input
                        type="text"
                        id="player2Name"
                        name="player2Name"
                        value={formData.player2Name}
                        onChange={handleInputChange}
                        placeholder="Enter player 2 Real name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="player2GameId">Player 2 Free Fire Game ID *</label>
                      <input
                        type="text"
                        id="player2GameId"
                        name="player2GameId"
                        value={formData.player2GameId}
                        onChange={handleInputChange}
                        placeholder="Enter Free Fire game ID"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-two-col">
                    <div className="form-group">
                      <label htmlFor="player3Name">Player 3 Name *</label>
                      <input
                        type="text"
                        id="player3Name"
                        name="player3Name"
                        value={formData.player3Name}
                        onChange={handleInputChange}
                        placeholder="Enter player 3 Real name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="player3GameId">Player 3 Free Fire Game ID *</label>
                      <input
                        type="text"
                        id="player3GameId"
                        name="player3GameId"
                        value={formData.player3GameId}
                        onChange={handleInputChange}
                        placeholder="Enter Free Fire game ID"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-two-col">
                    <div className="form-group">
                      <label htmlFor="player4Name">Player 4 Name *</label>
                      <input
                        type="text"
                        id="player4Name"
                        name="player4Name"
                        value={formData.player4Name}
                        onChange={handleInputChange}
                        placeholder="Enter player 4 Real name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="player4GameId">Player 4 Free Fire Game ID *</label>
                      <input
                        type="text"
                        id="player4GameId"
                        name="player4GameId"
                        value={formData.player4GameId}
                        onChange={handleInputChange}
                        placeholder="Enter Free Fire game ID"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-submit">
                    Complete Registration
                  </button>
                  <button type="button" className="btn btn-cancel" onClick={handleBack}>
                    Cancel
                  </button>
                </div>
              </form>
              
              <div className="selected-game-info">
                <div className="selected-game-info-wrapper">
                  <svg className="selected-game-info-text" viewBox="0 0 280 280">
                    <defs>
                      <path id="circlePath" d="M 140, 140 m -110, 0 a 110,110 0 1,1 220,0 a 110,110 0 1,1 -220,0"/>
                    </defs>
                    <text fontSize="20" fontWeight="bold" fill="#ffffff" letterSpacing="3" className="animated-text">
                      <textPath href="#circlePath" startOffset="0%" textAnchor="start">
                        {selectedGameData?.name.toUpperCase()} • {selectedGameData?.description} • {selectedGameData?.name.toUpperCase()} • 
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default Register;
