import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, Row, Col, Checkbox, Result, Spin, Space, Tag, Menu, Select, Button, message, Badge } from 'antd';
import { withLayer } from "@kne/antd-enhance";
import { apis as _apis } from './preset';
import uniq from 'lodash/uniq';

const getCount = (data,code,ids,sliceLength) => {
	const childId=ids.filter(id=>data.some(item=>code ===item.code && item.code === id.slice(0,sliceLength)));
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
	if (!data) {
		return <Spin />
	}
	return children(data)
};

const SearchInput = ({ onChange }) => {
	const [value, setValue] = useState(null);
	const [data, setData] = useState([]);
	return <Select value={value} onChange={(value) => {
		onChange && onChange(value);
		setValue(null);
		setData([]);
	}} showSearch placeholder="输入职能关键词" style={{ width: '250px' }}
		defaultActiveFirstOption={false}
		showArrow={false}
		notFoundContent={null}
		onSearch={(value) => {
			return apis.searchfunctions(value).then((list) => {
				console.log(111,list)
				setData(list);
			});
		}}
		filterOption={false} options={data} />
};

export const apis = _apis;

export const DisplayFunction = ({ id, children }) => {
	return <RemoteData loader={apis.getFunction} options={id}>{children}</RemoteData>
};

export { default as preset } from './preset';


const FunctionSelect = ({ dataSource, onCancel, title, size, defaultValue, onChange, modalTitleRight, ...props }) => {
	const [functions, setfunctions] = useState(defaultValue);
	const [selectedKeys, setSelectedKeys] = useState();
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

	const appendFunc = (code) => {
		if (size === 1) {
			setfunctions([code]);
			onChange([code]);
			return;
		}
		if (functions.length >= size) {
			message.error(`最多选择${size}个`);
			return;
		}
		const _Funcs = JSON.parse(JSON.stringify(functions))
		_Funcs.push(code);
		setfunctions([..._Funcs]);
	};
	const removeFunc = (code) => {
		setfunctions((list) => {
			const newList = list.slice(0);
			const index = list.indexOf(code);
			newList.splice(index, 1);
			return newList;
		});
	};

	return <Modal width={1000} centered {...props} onCancel={onCancel}
		title={<Row align="middle" justify="space-between">
			<Col>{title}</Col>
			<Col pull={2}><SearchInput

				onChange={(value) => {
					appendFunc(value);
				}} /></Col>
			{modalTitleRight && <Col pull={2}>
				{modalTitleRight}
			</Col>}
		</Row>} footer={null}>
		<Row wrap={false}>
			<Col span={5} style={{ height: "500px" }}>
				<div style={{ overflowY: 'auto', height: "100%" }}>
					<RemoteData loader={apis.getLeftList} onLoad={(data) => {
						data && data.length && setSelectedKeys(data[0].code);
					}}>{(data) => {
						return <Menu selectedKeys={selectedKeys} onSelect={(item) => {
							setSelectedKeys(item.key);
						}}>
							{data.map((item) => <Menu.Item key={item.code}>
								<Space>
									<span>{item.chName}</span>
									<Badge count={getCount(dataSource,item.code, functions,3)} />
								</Space>
							</Menu.Item>)}
						</Menu>;
					}}</RemoteData>
				</div>
			</Col>
			<Col span={5}>
				<div style={{ overflowY: 'auto', height: "500px" }}>
					<Row style={{ flex: 1 }}>
						<Col offset={1} flex={1}>
							<Space direction="vertical" style={{ width: '100%' }}>
								{
									<Space direction='vertical' size={16} style={{ width: "100%" }}>
										<Menu selectedKeys={secondSelectedKeys} onSelect={(item) => {
											setSecondSelectedKeys(item.key);
										}}>
											{secondList.map((item) => <Menu.Item key={item.code}>
												<Space>
													<span>{item.chName}</span>
													<Badge count={getCount(dataSource,item.code, functions,6)} />
												</Space>
											</Menu.Item>)}
										</Menu>

									</Space>

								}
							</Space>
						</Col>
					</Row>
				</div>
			</Col>
			<Col flex={1} style={{
				display: 'flex', flexDirection: 'column', height: '500px'
			}}>
				<div style={{ overflowY: 'auto', height: "100%" }}>
					<Row style={{ flex: 1 }}>
						<Col offset={1} flex={1}>
							<Space direction="vertical" style={{ width: '100%' }}>
								{
									<Space direction='vertical' size={16} style={{ width: "100%" }}>
										<Row wrap justify='space-between'>
											{(thirdList || []).map(({ code, chName }) => <Col span={8} key={code}>
												<Checkbox
													checked={functions.indexOf(code) > -1}
													onChange={(e) => {
														const checked = e.target.checked;
														if (checked) {
															appendFunc(code);
														} else {
															removeFunc(code);
														}
													}}
												>{chName}</Checkbox>
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
		<Row wrap={false} align="middle">
			<Col offset={1} style={{
				whiteSpace: 'nowrap'
			}}>已选{size > 1 ? <>（{functions.length}/{size}）</> : null}：</Col>
			<Col flex={1} style={{
				maxHeight: '70px', overflowY: 'auto'
			}}>
				{functions.map((id) => {
					return <DisplayFunction key={id} id={id}>{(data) => {
						return <Tag closable={size > 1} onClose={() => {
							removeFunc(id);
						}}>{data.chName}</Tag>;
					}}</DisplayFunction>
				})}
			</Col>
			{size > 1 ? <Col>
				<Space>
					<Button onClick={onCancel}>取消</Button>
					<Button type="primary" onClick={() => {
						onChange(functions);
					}}>确认</Button>

				</Space>
			</Col> : null}
		</Row>
	</Modal>
};

export const createFunctionSelect = withLayer(({ close, onChange, ...props }) => {
	return <RemoteData loader={apis.getAllList}>{(dataSource) => {
		return <FunctionSelect {...props} dataSource={dataSource} onCancel={close} onChange={(value) => {
			onChange && onChange(value);
			close();
		}} />
	}}</RemoteData>
});

FunctionSelect.defaultProps = {
	title: "请选择职能",
	size: 1,
	defaultValue: [],
	onChange: () => {
	}
};

export default FunctionSelect;