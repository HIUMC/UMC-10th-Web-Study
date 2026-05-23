type Props = {
  title: string;
  content: string;
};

function LpCard({ title, content }: Props) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "12px",
        width: "200px",
      }}
    >
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

export default LpCard;