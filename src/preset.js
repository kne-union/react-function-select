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
    getAllList: ()=>{
        return apis.loadData().then(({data}) => {
            return data
        });
    },
    getLeftList: () => {
        return apis.loadData().then(({data}) => {
            return data.filter(item=>!item.parentCode)
        });
    },
    getChildById: (data,id) => {
        return data.filter(item=>item.parentCode===id)
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
    searchfunctions: (value) => {
        if (!value) {
            return Promise.resolve([]);
        }
        return apis.loadData().then(({data}) => {
            return data.filter(item=>item.level === '1').filter((item) => {
                return ['chName', 'shortName', 'enName'].some((name) => {
                    return item[name].toUpperCase().indexOf(value.toUpperCase()) > -1;
                });
            }).map((item) => {
                return {
                    label: item.chName, 
                    value: item.code
                };
            });
        });
    }
};

const preset = (options) => {
    Object.assign(apis, options);
};

export default preset;

