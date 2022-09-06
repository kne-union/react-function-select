export const apis = {
    loadData: (() => {
        let cache;
        return () => {
            if (!cache) {
                cache = import('./function.json');
            }
            return cache;
        };
    })(),
    searchfunctions: (value) => {
        if (!value) {
            return Promise.resolve([]);
        }
        return apis.loadData().then(({data}) => {
            return data.filter(item=>item.code.length>6).filter((item) => {
                return ['chName', 'shortName', 'enName'].some((name) => {
                    return item[name].toUpperCase().indexOf(value.toUpperCase()) > -1;
                });
            }).map((item) => {
                const parentName=data.find(key=>key.code===item.parentCode)?data.find(key=>key.code===item.parentCode).chName:"";
                return {
                    label: `${parentName} / ${item.chName}`, 
                    value: item.code
                };
            });
        });
    },
    getFunction: (id) => {
        return apis.loadData().then(({data}) => {
            if(Array.isArray(id)){
                return data.filter(item=>{
                    return id.some(i=>item.code===i)
                })
            }
            if(typeof id === 'string'){
                return data.find(item=>item.code===id)
            }
            return null
        });
    }, 
    getAllList: ()=>{
        return apis.loadData().then(({data}) => {
            return data
        });
    },
    getLeftList: (data) => data.filter(item=>!item.parentCode),
    getChildById: (data,id) => data.filter(item=>item.parentCode===id),
    getFunctionById: (data,id) => {
        if(Array.isArray(id)){
            return data.filter(item=>{
                return id.some(i=>item.code===i)
            })
        }
        if(typeof id === 'string'){
            return data.find(item=>item.code===id)
        }
        return null
    }, 
    getFunctionByName:(data,name)=>{
        if(Array.isArray(name)){
            return data.filter(item=>{
                return name.some(i=>item.chName===i)
            })
        }
        if(typeof name === 'string'){
            return data.find(item=>item.chName===name)
        }
        return null
    }
};

const preset = (options) => {
    Object.assign(apis, options);
};

export default preset;

