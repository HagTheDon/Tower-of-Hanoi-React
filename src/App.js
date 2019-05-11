import React, { Component } from 'react';

const TOWERS_NUMBER = 3;
const winningTower = TOWERS_NUMBER - 1;
const discColours = [
  'gray',
  'red',
  'green',
  'cyan',
  'yellow',
  'orange',
  'magenta',
  'blue',
];

const Disc = ({size, topDisc, startDrag}) => {
  const discWidth = (size + 1.5) * 25;
  const discStyle = {
    width: discWidth + 'px',
    backgroundColor: discColours[size % 8],
  };

  return (
    <div
      className='disc'
      style={discStyle}
      draggable={topDisc}
      onDragStart={startDrag}
    >
      <span className='disc-label'>
        {size}
      </span>
    </div>
  );
}

const Tower = ({towerDiscs, maxSize, startTopDiscDrag, dropDisc}) => {
  const towerStyle = {width: (maxSize + 3) * 25};
  const pillarStyle = {height: 100 + maxSize * 20};

  return (
    <div
      className='tower'
      style={towerStyle}
      onDragOver={(e) => {e.preventDefault()}}
      onDrop={dropDisc}
    >
      <div className='tower-pillar' style={pillarStyle} />
      <div className='tower-base' />
      <div className='disc-group'>
        {towerDiscs.map((size, i) =>
          <Disc
            key={size.toString()}
            size={size}
            topDisc={i===0}
            startDrag={startTopDiscDrag}
          />
        )}
      </div>
    </div>
  );
};

class Towers extends Component {
  constructor(props) {
    super(props);
   this.state = {discs:[], status:'', moveCount: 0};
   this.resetTower = this.resetTower.bind(this);
  }

  componentDidMount() {
    this.resetTower();
  }

  resetTower() {
    let startTower = Array.from(Array(this.props.discsNumber), (_, i) => 1 + i);
    let discs = [...Array(TOWERS_NUMBER)].map((val, i) =>
     i === 0 ? startTower : []
    );
    this.setState ({
      discs:discs,
      status:'Start Game, move discs to tower.',
      moveCount:0
    });
  }

  startTopDiscDrag(activeTower) {
    this.activeTower = activeTower;
  }

  dropDisc(destTower) {
    const sourceTower = this.activeTower;
    this.activeTower = null;
    if (sourceTower === destTower || sourceTower === null) return;

    this.setState((state) => {
      if (state.discs[destTower][0] < state.discs[sourceTower][0]) return state.discs, {status:'Invalid move: Only move smaller disc to larger disc'};
      if (destTower === winningTower && state.discs[destTower].length === this.props.discsNumber-1) return state.discs, {status:'Congratulations, tower completed!'};
      let discs = [...state.discs];
      discs[sourceTower] = discs[sourceTower].slice(1);
      discs[destTower] = [state.discs[sourceTower][0], ...state.discs[destTower]];
      return {discs, status:'', moveCount: state.moveCount + 1};
    });
  }

  render() {
    return (
      <div>
        <p>Moves: {this.state.moveCount}</p>
        {this.state.discs.map((towerDiscs, i) =>
          <Tower
            key={i+1}
            towerDiscs={towerDiscs}
            maxSize={this.props.discsNumber}
            startTopDiscDrag={() => this.startTopDiscDrag(i)}
            dropDisc={() => this.dropDisc(i)}
          />
        )}
        <p>{this.state.status}</p>
        <button className="button" onClick={this.resetTower}>Reset Tower</button>
      </div>
    );
  }
}

const App = () => (
  <div className="content">
    <h1>Tower of Hanoi</h1>
    <Towers discsNumber={5} />
  </div>
);

export default App;
