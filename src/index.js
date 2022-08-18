import React, { useState, useEffect, useRef } from 'react';
import { Modal, Row, Col, Checkbox, Result, Spin, Space, Tag, Anchor, Select, Button, message, Badge } from 'antd';
import { withLayer } from "@kne/antd-enhance";
import { apis as _apis } from './preset';
const getCount = (data, id, selectedKeys) => {
	const childId = (data || []).filter(item => item.parentCode === id && selectedKeys.indexOf(item.code) > -1).map(item => item.code);
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
	}} showSearch placeholder="输入行业关键词" style={{ width: '250px' }}
		defaultActiveFirstOption={false}
		showArrow={false}
		notFoundContent={null}
		onSearch={(value) => {
			return apis.searchIndustries(value).then((list) => {
				setData(list);
			});
		}}
		filterOption={false} options={data} />
};

export const apis = _apis;

export const DisplayIndustry = ({ id, children }) => {
	return <RemoteData loader={apis.getIndustry} options={id}>{children}</RemoteData>
};

export { default as preset } from './preset';


const IndustrySelect = ({ onCancel, title, size, defaultValue, onChange, modalTitleRight, ...props }) => {
	const [industries, setIndustries] = useState(defaultValue);
	const appendCity = (code) => {
		if (size === 1) {
			setIndustries([code]);
			onChange([code]);
			return;
		}
		if (industries.length >= size) {
			message.error(`最多选择${size}个`);
			return;
		}
		const _citys = JSON.parse(JSON.stringify(industries))
		_citys.push(code);
		setIndustries([..._citys]);
	};
	const removeCity = (code) => {
		setIndustries((list) => {
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
				appendCity(value);
			}} /></Col>
		{modalTitleRight && <Col pull={2}>
			{modalTitleRight}
		</Col>}
	</Row>} footer={null}>
		<RemoteData loader={apis.getAllList}>{(dataSource) => {
			return <>
				<Row wrap={false}>
					<Col span={4} style={{ height: "500px" }}>
						<div style={{ overflowY: 'auto', height: "100%" }}>
							<RemoteData loader={apis.getLeftList} >{(data) => {
								return <Anchor bounds={0} showInkInFixed={false} affix={false} getCurrentAnchor={(activeLink) => {
									if (activeLink) {
										return activeLink
									}
									return `#${data[0].chName}`
								}}>
									{data.map(item => {
										return <Anchor.Link key={item.code} title={<Space>
											<span>{item.chName}</span>
											<Badge count={getCount(dataSource, item.code, industries)} />
										</Space>} href={`#${item.chName}`} />

									})}
								</Anchor>
							}}</RemoteData>
						</div>
					</Col>
					<Col flex={1} style={{
						display: 'flex', flexDirection: 'column', height: '500px'
					}}>
						<div style={{ overflowY: 'auto', height: "100%" }}>
							<Row style={{ flex: 1 }}>
								<Col offset={1} flex={1}>
									<Space direction="vertical" style={{ width: '100%' }}>
										<RemoteData loader={apis.getAllRightList}>{(data) => {
											return data.map((first, index) => {
												return <Space direction='vertical' key={first.code} size={16} style={{width: "100%"}}>
													<div style={{ fontWeight: 500, marginTop: index !== 0 ? 32 : 0 }} className="right-first-title" id={first.chName}>{first.chName}</div>
													<Row wrap justify='space-between'>
														{(first.childList || []).map(({ code, chName }) => <Col span={8} key={code}>
															<Checkbox
															checked={industries.indexOf(code) > -1}
															onChange={(e) => {
																const checked = e.target.checked;
																if (checked) {
																	appendCity(code);
																} else {
																	removeCity(code);
																}
															}}
														>{chName}</Checkbox>
														</Col>)}
													</Row>
												</Space>
											})
										}}</RemoteData>

									</Space>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
				<Row wrap={false} align="middle">
					<Col offset={1} style={{
						whiteSpace: 'nowrap'
					}}>已选{size > 1 ? <>（{industries.length}/{size}）</> : null}：</Col>
					<Col flex={1} style={{
						maxHeight: '70px', overflowY: 'auto'
					}}>
						{industries.map((id) => {
							return <DisplayIndustry key={id} id={id}>{(data) => {
								return <Tag closable={size > 1} onClose={() => {
									removeCity(id);
								}}>{data.chName}</Tag>;
							}}</DisplayIndustry>
						})}
					</Col>
					{size > 1 ? <Col>
						<Space>
							<Button onClick={onCancel}>取消</Button>
							<Button type="primary" onClick={() => {
								onChange(industries);
							}}>确认</Button>

						</Space>
					</Col> : null}

				</Row>
			</>
		}}</RemoteData>
	</Modal>
};

IndustrySelect.defaultProps = {
	title: "请选择行业",
	size: 1,
	defaultValue: [],
	onChange: () => {
	}
};

export const createIndustrySelect = withLayer(({ close, onChange, ...props }) => {
	return <IndustrySelect {...props} onCancel={close} onChange={(value) => {
		onChange && onChange(value);
		close();
	}} />
});

export default IndustrySelect;