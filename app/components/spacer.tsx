interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  horizontal?: boolean;
  vertical?: boolean;
  style?: React.CSSProperties;
}

export default function Spacer({
  size = 1,
  horizontal = false,
  vertical = false,
  style = {},
  ...props
}: Props) {
  const width = vertical ? 1 : size;
  const height = horizontal ? 1 : size;
  return (
    <span
      style={{
        display: "block",
        width,
        minWidth: width,
        height,
        minHeight: height,
        ...style,
      }}
      {...props}
    />
  );
}
