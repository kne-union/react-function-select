export const apis = {
    loadData: (() => {
        let cache;
        return () => {
            if (!cache) {
                cache = import('./industry.json');
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
            return data.filter(item=>item.level === '0'&&item.code!=="000")
        });
    },
    getRightList: (id) => {
        return apis.loadData().then(({data}) => {
            return data.filter(item=>item.level === '1'&&item.parentCode===id)
        });
    },
    getChildById: (data,id) => {
        return data.filter(item=>item.level === '1'&&item.parentCode===id)
    },
    getAllRightList: ()=>{
        return apis.loadData().then(({data}) => {
            return data.filter(item=>item.level === '0'&&item.code!=="000").map(item=>{
                return {...item,childList: apis.getChildById(data,item.code)}
            })
        });
    },
    getIndustry: (id) => {
        return apis.loadData().then(({data}) => {
            if(Array.isArray(id)){
                return data.filter(item=>{
                    return id.some(i=>item.level === '1'&&item.code===i)
                })
            }
            if(typeof id === 'string'){
                return data.find(item=>item.level === '1'&&item.code===id)
            }
            return null
        });
    }, 
    searchIndustries: (value) => {
        if (!value) {
            return Promise.resolve([]);
        }
        return apis.loadData().then(({data}) => {
            return data.filter(item=>item.level === '1').filter((item) => {
                return ['pinyin', 'chName', 'shortName', 'enName'].some((name) => {
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

