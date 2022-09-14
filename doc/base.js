const {createFunctionSelect,DisplayFunction}=FunctionSelect;
const {Button}=Antd;

const {useState}=React;

const BaseExample = ()=>{
    const [v,setV]=useState([{label:"sdsf",value:"002013"}]);

    return <Button onClick={()=>{
        createFunctionSelect({
            labelInValue:true,
            defaultValue:v,
            size:3,
            onChange:(code)=>{
                setV(code);
            }
        })
    }}>
      <DisplayFunction id={v.map(item=>item.value)}>{(list)=>{
            if(Array.isArray(list)){
                return list.map(item=>item.chName).join(",")
            }
            return list&&list.chName
        }}</DisplayFunction>  
    </Button>
};

render(<BaseExample />);
