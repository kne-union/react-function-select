import * as component_3 from '@kne/react-function-select';
import * as component_4 from 'antd';
const readmeConfig = {
    name: `@kne/react-function-select`,
    description: `职能选择器`,
    summary: `<p>职能选择器，可支持多选和单选，可以通过覆盖preset的apis的方法扩展此组件</p>`,
    api: `<h3>其他属性参考antd modal的props</h3>
<table>
<thead>
<tr>
<th>属性名</th>
<th>说明</th>
<th>类型</th>
<th>默认值</th>
</tr>
</thead>
<tbody>
<tr>
<td>title</td>
<td>模态框标题</td>
<td>string</td>
<td>-</td>
</tr>
<tr>
<td>size</td>
<td>支持多选</td>
<td>boolean</td>
<td>1</td>
</tr>
<tr>
<td>defaultValue</td>
<td>默认选中项</td>
<td>array</td>
<td>-</td>
</tr>
<tr>
<td>onChange</td>
<td>选中触发事件</td>
<td>function(value)</td>
<td>-</td>
</tr>
</tbody>
</table>
<h3>FunctionSelect.createFunctionSelect</h3>
<p>参数同上</p>
<h3>FunctionSelect.DisplayFunction</h3>
<h4>这是一个组件</h4>
<table>
<thead>
<tr>
<th>属性名</th>
<th>说明</th>
<th>类型</th>
<th>默认值</th>
</tr>
</thead>
<tbody>
<tr>
<td>id</td>
<td>选中的项的id，支持字符串或数组格式</td>
<td>string/array</td>
<td>-</td>
</tr>
<tr>
<td>children</td>
<td>id是数组返回的也是数组，id是字符串，返回的是对象</td>
<td>function({list}=&gt;{})</td>
<td>-</td>
</tr>
</tbody>
</table>
<h4>preset</h4>
<table>
<thead>
<tr>
<th>属性名</th>
<th>说明</th>
<th>类型</th>
<th>默认值</th>
</tr>
</thead>
<tbody>
<tr>
<td>options</td>
<td>需要覆盖的参数,具体参数参考下面api部分</td>
<td>object</td>
<td>-</td>
</tr>
</tbody>
</table>
<h4>api</h4>
<table>
<thead>
<tr>
<th>属性名</th>
<th>说明</th>
<th>类型</th>
<th>默认值</th>
</tr>
</thead>
<tbody>
<tr>
<td>loadData</td>
<td>获取职能数据，默认采用内置数据</td>
<td>function</td>
<td>-</td>
</tr>
<tr>
<td>getAllList</td>
<td>获取所有职能数据列表</td>
<td>function</td>
<td>-</td>
</tr>
<tr>
<td>getLeftList</td>
<td>获取左侧一级职能列表</td>
<td>funciton</td>
<td>-</td>
</tr>
<tr>
<td>getFunctionByName(name)</td>
<td>传入职能name返回职能数据</td>
<td>function</td>
<td>-</td>
</tr>
<tr>
<td>getFunction(id)</td>
<td>传入职能ID返回职能数据</td>
<td>function</td>
<td>-</td>
</tr>
<tr>
<td>getChildById(id)</td>
<td>通过id，获取子级职能集合</td>
<td>function</td>
<td>-</td>
</tr>
<tr>
<td>searchfunctions(searchStr)</td>
<td>通过关键字搜索职能，支持拼音首字母缩写</td>
<td>function</td>
<td>-</td>
</tr>
<tr>
<td>labelInValue</td>
<td>value是否包含label</td>
<td>boolean</td>
<td>false</td>
</tr>
<tr>
<td>selectAll</td>
<td>允许选择所有层级level</td>
<td>boolean</td>
<td>false</td>
</tr>
</tbody>
</table>`,
    example: {
        isFull: false,
        className: `react_function_select_fea97`,
        style: ``,
        list: [{
    title: `职能多选`,
    description: `多选`,
    code: `const {createFunctionSelect,DisplayFunction}=FunctionSelect;
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

`,
    scope: [{
    name: "FunctionSelect",
    packageName: "@kne/react-function-select",
    component: component_3
},{
    name: "Antd",
    packageName: "antd",
    component: component_4
}]
},{
    title: `职能单选`,
    description: `单选`,
    code: `const {createFunctionSelect,DisplayFunction}=FunctionSelect;
const {Button}=Antd;

const {useState}=React;

const BaseExample = ()=>{
    const [v,setV]=useState(["002002013"]);

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

`,
    scope: [{
    name: "FunctionSelect",
    packageName: "@kne/react-function-select",
    component: component_3
},{
    name: "Antd",
    packageName: "antd",
    component: component_4
}]
},{
    title: `职能多选层级`,
    description: `多选`,
    code: `const {createFunctionSelect,DisplayFunction}=FunctionSelect;
const {Button}=Antd;

const {useState}=React;

const BaseExample = ()=>{
    const [v,setV]=useState([{label:"sdsf",value:"002002013"}]);

    return <Button onClick={()=>{
        createFunctionSelect({
            labelInValue:true,
            defaultValue:v,
            size:3,
            selectLevel:3,
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

`,
    scope: [{
    name: "FunctionSelect",
    packageName: "@kne/react-function-select",
    component: component_3
},{
    name: "Antd",
    packageName: "antd",
    component: component_4
}]
}]
    }
};
export default readmeConfig;
