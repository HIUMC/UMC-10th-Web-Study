type Tech = 'REACT' | 'NEXT' | 'VUE' | 'SVELTE' | 'ANGULAR' | 'REACT-NATIVE'; // union type 으로 구체적으로 제한

interface ListProps {
    tech : Tech;
}


const List = ({tech} : ListProps) => {
    console.log(tech)
    return (
        <li style={{listStyle : 'none'}}>
            {tech}
        </li>
    )
};

export default List;
