import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, Row, Col, Checkbox, Result, Divider, Space, Tag, Menu, Select, Button, message, Badge } from 'antd';
import withLayer from '@kne/with-layer';
import { apis as _apis } from './preset';
import "./index.scss";
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';

const getCount = (data, code, ids, sliceLength) => {
	const childId = ids.filter(id => data.some(item => code === item.code && item.code === id.slice(0, sliceLength)));
	return childId.length;
}

export const RemoteData = ({ loader, options, onLoad, children }) => {
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);
	const onLoadRef = useRef(onLoad);
	onLoadRef.current = onLoad;
	useEffect(() => {
		Promise.resolve(loader(options)).then((data) => {
			onLoadRef.current && onLoadRef.current(data);
			setData(data);
		}).catch((e) => {
			console.error(e);
			setError(e);
		});
	}, [loader, options]);
	if (error) {
		return <Result status="error" title="获取数据发生错误" subTitle={error.message} />
	}
	if (!data||get(data,'length',0)===0) {
		return "-"
	}
	return children(data)
};

const SearchInput = ({ dataSource,onChange, functionsCode ,level}) => {
	const [value, setValue] = useState(null);
	const [data, setData] = useState([]);
	return <Select className='function-modal-search' value={value} onChange={(value) => {
		if (functionsCode.indexOf(value) > -1) return;
		onChange && onChange(_apis.getFunctionById(dataSource,value));
		setValue(null);
		setData([]);
	}} showSearch placeholder="输入职能关键词" style={{ width: '250px' }}
		defaultActiveFirstOption={false}
		showArrow={false}
		notFoundContent={null}
		onSearch={(value) => {
			return _apis.searchfunctions(value,level).then((list) => {
				setData(list);
			});
		}}
		filterOption={false} options={data} />
};

export const apis = _apis;

export const DisplayFunction = ({ id, children }) => {
	if(!Array.isArray(id)){
		id=[id];
	}
	return <RemoteData loader={apis.getFunction} options={id}>{children}</RemoteData>
};

export { default as preset } from './preset';


const FunctionSelect = ({ labelInValue, dataSource, onCancel, title, size, defaultValue, onChange, modalTitleRight, selectLevel, ...props }) => {
	const [functions, setfunctions] = useState((() => {
		if (!Array.isArray(defaultValue)) return [];
		const _default = labelInValue ? defaultValue.map(item => get(item, "value")) : defaultValue;
		return _default.map(id => {
			const _filter = apis.getFunctionById(dataSource, id)||{};

			if (_filter) {
				return {
					label: _filter.chName,
					value: _filter.code,
					parentCode: _filter.parentCode,
					storey: _filter.storey
				}
			}
			return defaultValue[index]
		})
	})());

	const firstList = useMemo(() => {
		return apis.getLeftList(dataSource);
	}, [dataSource]);
	const [selectedKeys, setSelectedKeys] = useState(get(firstList, '[0].code'));
	const [secondSelectedKeys, setSecondSelectedKeys] = useState();

	const secondList = useMemo(() => {
		return apis.getChildById(dataSource, selectedKeys);
	}, [dataSource, selectedKeys]);

	const thirdList = useMemo(() => {
		return apis.getChildById(dataSource, secondSelectedKeys)
	}, [dataSource, secondSelectedKeys]);

	useEffect(() => {
		if (Array.isArray(secondList) && secondList.length > 0) {
			setSecondSelectedKeys(secondList[0].code);
		}
	}, [secondList]);

	const appendFunc = (item) => {
		const { chName: label, storey, parentCode, code: value } = item;

		let _functions = cloneDeep(functions);
		
		if (_functions.length >= size) {
			message.error(`最多选择${size}个`);
			return;
		}
		if (storey === '2') {
			_functions = _functions.filter(item => item.parentCode !== value);
		}
		if (storey === '1') {
			_functions = _functions.filter(item => item.value.slice(0,3) !== value);
		}

		_functions.push({ label, storey, parentCode, value });

		setfunctions([..._functions]);
	};

	const removeFunc = (code={}) => {
		setfunctions((list) => {
			let _list = cloneDeep(list);
			if (code.storey === '2') {
				_list = list.filter(item => item.parentCode !== code)
			}
			if (code.storey === '1') {
				_list = list.filter(item => item.code.slice(0,3) !== code)
			}
			const index = _list.map(item => get(item, 'value')).indexOf(code);
			_list.splice(index, 1);
			return _list;
		});
	};
	const functionsCode = useMemo(() => {
		return functions.map(item => get(item, 'value', ""));
	}, [functions]);

	useEffect(()=>{
		if (get(defaultValue,'length',0)>0) {
			const _code=labelInValue?get(defaultValue,"[0].value"):defaultValue[0];
			if(_code){
				setSelectedKeys(_code.slice(0,3));
				setSecondSelectedKeys(_code.slice(0,6))
			}
		}
	},[defaultValue,dataSource,labelInValue])
	
	return <Modal {...props} width={1000} centered
		wrapClassName="function-modal" onCancel={onCancel}
		title={<Row align="middle" justify="space-between">
			<Col>{title}</Col>
			<Col pull={1}>
				<SearchInput
				dataSource={dataSource}
					level={selectLevel}
					functionsCode={functionsCode}
					onChange={(value) => {
						appendFunc(value);
						setSelectedKeys(value.code.slice(0,3));
						setSecondSelectedKeys(value.code.slice(0,6))
					}} /></Col>
			{modalTitleRight && <Col pull={2}>
				{modalTitleRight}
			</Col>}
		</Row>} footer={
			<Space className='function-modal-footer' direction='vertical' size={0}>
				<Row align='middle' justify='start' className='function-modal-footer-top'>
					<Space wrap={false} size={8} className='function-modal-selected'>
						<span style={{
							whiteSpace: 'nowrap'
						}}>已选（{functions.length}/{size}）：</span>
						{functions.map(({ value, label }, index) => {
							return <Tag key={value} className='industry-modal-tag' closable={true} onClose={() => {
								removeFunc(value);
							}}>{label}</Tag>;
						})}
					</Space>
				</Row>
				<Divider/>
				<Row justify='end' className='function-modal-footer-bottom'>
					<Space size={8} >
						<Button onClick={onCancel}>取消</Button>
						<Button type="primary" onClick={() => {
							onChange(functions);
						}}>确认</Button>
					</Space>
				</Row>
			</Space>}>
		<Row wrap={false}>
			<Col className='function-modal-left'>
				<div className='function-modal-left-overflow'>
					<Menu selectedKeys={selectedKeys} onSelect={(item) => {
						setSelectedKeys(item.key);
					}}>
						{firstList.map((item) => {
							const count = getCount(dataSource, item.code, functionsCode, 3);
							return <Menu.Item key={item.code}>
								{selectLevel > 2 ? <Space>
									<Checkbox
										checked={functionsCode.indexOf(item.code) > -1}
										indeterminate={functions.some(key => (get(key,"parentCode") === item.code||get(key,"value","").slice(0,3)===item.code) && functionsCode.indexOf(item.code) === -1)}
										onChange={(e) => {
											const checked = e.target.checked;
											if (checked) {
												appendFunc(item);
											} else {
												removeFunc(item.code);
											}
										}} />
									<span>{item.chName}</span>
								</Space> :
									<Space>
										<span>{item.chName}</span>
										{count > 0 && <span className="function-modal-count">({count})</span>}
									</Space>}
							</Menu.Item>
						})}
					</Menu>
				</div>
			</Col>
			<Col className='function-modal-center'>
				<div style={{ overflowY: 'auto', height: "100%" }}>
					<Row style={{ flex: 1 }}>
						<Menu selectedKeys={secondSelectedKeys} onSelect={(item) => {
							setSecondSelectedKeys(item.key);
						}}>
							{secondList.map((item) => {
								const count = getCount(dataSource, item.code, functionsCode, 6);
								return <Menu.Item key={item.code}>
									{selectLevel > 1 ? <Space>
										<Checkbox
											disabled={selectLevel > 2 && functionsCode.indexOf(item.parentCode) > -1 ? true : false}
											checked={selectLevel > 2 && functionsCode.indexOf(item.parentCode) > -1 ? true : functionsCode.indexOf(item.code) > -1}
											indeterminate={functions.some(key => key.parentCode === item.code && functionsCode.indexOf(item.code) === -1)}
											onChange={(e) => {
												const checked = e.target.checked;
												if (checked) {
													appendFunc(item);
												} else {
													removeFunc(item.code);
												}
											}} />
										<span>{item.chName}</span>
									</Space> :
										<Space>
											<span>{item.chName}</span>
											{count > 0 && <span className="function-modal-count">({count})</span>}
										</Space>}
								</Menu.Item>
							})}
						</Menu>
					</Row>
				</div>
			</Col>
			<Col flex={1} className='function-modal-right'>
				<div style={{ overflowY: 'auto', height: "100%" }}>
					<Row style={{ flex: 1 }} className="function-modal-right-content">
						<Col offset={1} flex={1}>
							<Space direction="vertical" style={{ width: '100%' }}>
								{
									<Space direction='vertical' size={16} style={{ width: "100%" }}>
										<Row wrap justify='space-between'>
											{(thirdList || []).map((item) => <Col span={8} key={item.code}>
												<Checkbox
													disabled={selectLevel > 1 && (functionsCode.indexOf(item.parentCode) > -1||functionsCode.indexOf(item.code.slice(0,3)) > -1) ? true : false}
													checked={selectLevel > 1 && (functionsCode.indexOf(item.parentCode) > -1||functionsCode.indexOf(item.code.slice(0,3)) > -1) ? true : functionsCode.indexOf(item.code) > -1}
													onChange={(e) => {
														const checked = e.target.checked;
														if (checked) {
															appendFunc(item);
														} else {
															removeFunc(item.code);
														}
													}}
												>{item.chName}</Checkbox>
											</Col>)}
										</Row>
									</Space>
								}
							</Space>
						</Col>
					</Row>
				</div>
			</Col>
		</Row>
	</Modal>
};

export const createFunctionSelect = withLayer(({ close, onChange, labelInValue, ...props }) => {
	return <RemoteData loader={apis.getAllList}>{(dataSource) => {
		return <FunctionSelect {...props}
			labelInValue={labelInValue}
			dataSource={dataSource} onCancel={close} onChange={(value) => {
				let changeValue = [],valueObj=[];
				if (get(value, 'length', 0) > 0) {
					valueObj=value.map(item => ({ label: get(item, "label"), value: get(item, 'value') }));
					changeValue = labelInValue ? valueObj :value.map(item => get(item, "value"))
				}

				onChange && onChange(changeValue,valueObj);
				close();
			}} />
	}}</RemoteData>
});

FunctionSelect.defaultProps = {
	title: "请选择职能",
	size: 1,
	defaultValue: [],
	labelInValue: false,
	selectLevel: 1,
	onChange: () => {
	}
};

export default FunctionSelect;