const {createFunctionSelect,DisplayFunction}=FunctionSelect;
const {Button}=Antd;

const {useState}=React;

const BaseExample = ()=>{
    const [v,setV]=useState(["007030237"]);

    return <Button onClick={()=>{
        createFunctionSelect({
            defaultValue:v,
            size:1,
            onChange:(code)=>{
                setV(code);
            }
        })
    }}>
        <DisplayFunction id={v}>{(list)=>{
            if(Array.isArray(list)){
                return list.map(item=>item.chName).join(",")
            }
            return list&&list.chName
        }}</DisplayFunction>
    </Button>
};

render(<BaseExample />);
