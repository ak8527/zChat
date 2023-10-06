const CircularProgressBar = ({
  className,
  strokeWidth,
  progress,
  labelSize,
}) => {
  const size = 100;
  const center = size / 2;
  const radius = center - strokeWidth;
  const width = size;
  const height = size;
  const arcLength = 2 * Math.PI * radius;
  const arcOffset = arcLength * ((100 - progress) / 100);

  return (
    <div
      className={`${className ?? ''}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <svg style={{ width, height, transform: `rotate(${-90}deg)` }}>
        <circle
          id='track'
          cx={center}
          cy={center}
          r={radius}
          fill='transparent'
          stroke={'#989ab4'}
          strokeWidth={strokeWidth}
        ></circle>
        <circle
          id='indicator'
          cx={center}
          cy={center}
          r={radius}
          fill={'transparent'}
          stroke={'#50577a'}
          strokeWidth={strokeWidth}
          strokeLinecap={'round'}
          strokeDasharray={arcLength}
          strokeDashoffset={arcOffset}
        ></circle>
      </svg>
      <label
        style={{
          position: 'absolute',
          margin: 'auto',
          textAlign: 'center',
          fontSize: `${labelSize ?? '1rem'}`,
          color: '#50577a',
        }}
      >
        {`${progress ?? 0}%`}
      </label>
    </div>
  );
};

export default CircularProgressBar;
