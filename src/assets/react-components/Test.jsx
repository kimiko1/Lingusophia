const SvgTest = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={120} height={120} {...props}>
    <style>
      {
        ".test_svg__bg{fill:#3456e8}.test_svg__text{fill:#fff;font-family:sans-serif;font-size:24px;text-anchor:middle;dominant-baseline:central}"
      }
    </style>
    <rect width={50} height={50} x={5} y={5} className="test_svg__bg" rx={10} />
    <text x={30} y={30} className="test_svg__text">
      {"a"}
    </text>
    <circle cx={90} cy={30} r={25} className="test_svg__bg" />
    <rect
      width={50}
      height={50}
      x={5}
      y={65}
      className="test_svg__bg"
      rx={10}
    />
    <text x={30} y={90} className="test_svg__text">
      {"\u8BF6"}
    </text>
    <rect
      width={50}
      height={50}
      x={65}
      y={65}
      className="test_svg__bg"
      rx={10}
    />
    <text x={90} y={90} className="test_svg__text">
      {"\uD83D\uDE0A"}
    </text>
  </svg>
);
export default SvgTest;
