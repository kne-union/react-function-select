import * as component_3 from '@kne/react-industry-select';
import * as component_4 from 'antd';
const readmeConfig = {
    name: `@kne/react-industry-select`,
    description: `行业选择器`,
    summary: `<p>行业选择器，可支持多选和单选，可以通过覆盖preset的apis的方法扩展此组件</p>`,
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
<h3>IndustrySelect.createIndustrySelect</h3>
<p>参数同上</p>
<h3>IndustrySelect.DisplayIndustry</h3>
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
<td>获取行业数据，默认采用内置数据</td>
<td>function</td>
<td>-</td>
</tr>
<tr>
<td>getAllList</td>
<td>获取所有行业数据列表</td>
<td>function</td>
<td>-</td>
</tr>
<tr>
<td>getLeftList</td>
<td>获取左侧一级行业列表</td>
<td>funciton</td>
<td>-</td>
</tr>
<tr>
<td>getAllRightList</td>
<td>获取包含一级二级数据列表</td>
<td>function</td>
<td>-</td>
</tr>
<tr>
<td>getIndustry(id)</td>
<td>传入行业ID返回行业数据</td>
<td>function</td>
<td>-</td>
</tr>
<tr>
<td>getChildById(id)</td>
<td>通过一级id，获取二级行业</td>
<td>function</td>
<td>-</td>
</tr>
<tr>
<td>searchIndustries(searchStr)</td>
<td>通过关键字搜索行业，支持拼音首字母缩写</td>
<td>function</td>
<td>-</td>
</tr>
</tbody>
</table>`,
    example: {
        isFull: false,
        className: `react_industry_select_8c848`,
        style: ``,
        list: [{
    title: `行业类别多选`,
    description: `多选`,
    code: `const {createIndustrySelect,DisplayIndustry}=IndustrySelect;
const {Button}=Antd;

const {useState}=React;

const BaseExample = ()=>{
    const [v,setV]=useState(["040","420"]);

    return <Button onClick={()=>{
        createIndustrySelect({
            defaultValue:v,
            size:3,
            onChange:(code)=>{
                setV(code);
            }
        })
    }}>
        <DisplayIndustry id={v}>{(list)=>{
            if(Array.isArray(list)){
                return list.map(item=>item.chName).join(",")
            }
            return list&&list.chName
        }}</DisplayIndustry>
    </Button>
};

render(<BaseExample />);

`,
    scope: [{
    name: "IndustrySelect",
    packageName: "@kne/react-industry-select",
    component: component_3
},{
    name: "Antd",
    packageName: "antd",
    component: component_4
}]
},{
    title: `行业类别单选`,
    description: `单选`,
    code: `const {createIndustrySelect,DisplayIndustry}=IndustrySelect;
const {Button}=Antd;

const {useState}=React;

const BaseExample = ()=>{
    const [v,setV]=useState(["040"]);

    return <Button onClick={()=>{
        createIndustrySelect({
            defaultValue:v,
            size:1,
            onChange:(code)=>{
                setV(code);
            }
        })
    }}>
        <DisplayIndustry id={v}>{(list)=>{
            if(Array.isArray(list)){
                return list.map(item=>item.chName).join(",")
            }
            return list&&list.chName
        }}</DisplayIndustry>
    </Button>
};

render(<BaseExample />);

`,
    scope: [{
    name: "IndustrySelect",
    packageName: "@kne/react-industry-select",
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
