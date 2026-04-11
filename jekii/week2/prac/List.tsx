//유니온 타입으로 string 보다 실제 사용하는 스택만 받을 수 있도록 함
type Tech = "REACT" | "NEXT" | "VUE" | "SVELTE" | "ANGULAR" | "REACT-NATIVE";

interface ListProps {
  tech: Tech;
}

const List = (props: ListProps) => {
  return (
    <li style={{ listStyle: "none" }}>
      {props.tech === "REACT" ? "고구마와 함께하는 리액트" : props.tech}
    </li>
  );
};

export default List;
