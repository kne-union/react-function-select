
# react-function-select


### 描述

职能选择器


### 安装

```shell
npm i --save @kne/react-function-select
```


### 概述

职能选择器，可支持多选和单选，可以通过覆盖preset的apis的方法扩展此组件


### 示例

#### 示例代码

- 职能多选
- 多选
- FunctionSelect(@kne/react-function-select),Antd(antd)

```jsx
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

```

- 职能单选
- 单选
- FunctionSelect(@kne/react-function-select),Antd(antd)

```jsx
const {createFunctionSelect,DisplayFunction}=FunctionSelect;
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

```

- 职能多选层级
- 多选
- FunctionSelect(@kne/react-function-select),Antd(antd)

```jsx
const {createFunctionSelect,DisplayFunction}=FunctionSelect;
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

```


### API

### 其他属性参考antd modal的props
|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
|  title  | 模态框标题 | string | - |
|  size  | 支持多选 | boolean | 1 |
|  defaultValue  | 默认选中项 | array | - |
|  onChange  | 选中触发事件 | function(value) | - |


### FunctionSelect.createFunctionSelect
参数同上

### FunctionSelect.DisplayFunction
#### 这是一个组件
|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
|  id  | 选中的项的id，支持字符串或数组格式 | string/array | - |
|  children  | id是数组返回的也是数组，id是字符串，返回的是对象 | function({list}=>{}) | - |


#### preset

| 属性名          | 说明                    | 类型     | 默认值 |
|--------------|-----------------------|--------|-----|
|options| 需要覆盖的参数,具体参数参考下面api部分 |object|-|

#### api

| 属性名                     | 说明                    | 类型     | 默认值 |
|-------------------------|-----------------------|--------|-----|
| loadData                | 获取职能数据，默认采用内置数据|function|-|
| getAllList          |获取所有职能数据列表|function|-|
| getLeftList            |获取左侧一级职能列表|funciton|-|
| getFunctionByName(name)             |传入职能name返回职能数据|function|-|
| getFunction(id)             |传入职能ID返回职能数据|function|-|
| getChildById(id)     |通过id，获取子级职能集合|function|-|
| searchfunctions(searchStr) |通过关键字搜索职能，支持拼音首字母缩写|function|-|
|  labelInValue  | value是否包含label | boolean | false |
|  selectAll  | 允许选择所有层级level | boolean | false |
