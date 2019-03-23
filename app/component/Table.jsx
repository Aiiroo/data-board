import React from 'react';
import ReactDOM from 'react-dom';
import Table from '../src/Table/index.js';
import Animate from 'rc-animate';
import {isEqual} from '../utils/BaseUtils.js';
import '../assets/Table/index.less';
import '../assets/Table/animation.less';
import {sort} from '../utils/BaseUtils.js';

class TableModel extends React.Component {
	constructor(props) {
		super(props);
		this.newProps = props;
		this.columns = this.setColumnsRender(props.columns);
		this.state = {
			data: []
		};
		this.timerKeys = []; // 定时器key数组
		this.sorts = []; // 排序规则
	}
	// 初始化检索columns，获得排序规则
	initSort() {
		// 先重置
		this.sorts = [];

		let cols = this.columns;
		let i = 0;
		for (i; i < cols.length; i++) {
			let col = cols[i];
			if (Math.abs(col['sort']) > 0) {
				this.sorts.push({
					sortKey: col['dataIndex'],
					sortLevel: Math.abs(col['sort']), // 仅用于规则排序
					direction: col['sort'] > 0 ? 1 : -1
				});
			}
		}
		// 把排序规则排序
		sort(this.sorts, [{ key: 'sortLevel', direction: 1 }]);
	}
	// 根据sort值分层排序data
	sortData(data) {
		let sortArray = this.sorts.map(function (s, i) {
			return {
				key: s.sortKey,
				direction: s.direction
			};
		});
		if (sortArray) { }
		let sortData = sort(data || [], sortArray);
		return sortData;
	}
	// 根据renderName设置每列的render
	setColumnsRender(columns) {
		let cols = columns;
		// 如果需要增加序号列
		if (this.newProps.index) {
			cols.unshift({
				key: 'index',
				title: '序号',
				render: 'index_render'
			})
		}
		// 根据render方法名获得对应方法实体
		for (let i = 0; i < cols.length; i++) {
			let col = cols[i];
			let renderFunction = col.render ? col.render : this.newProps.render ? this.newProps.render : function (_v, _r, _i) { return { children: _v, props: {} } };
			col.render = renderFunction;
		}
		return cols;
	}
	// 设置排序合并以及表头和表体列对齐
	onShow() {
		this.adaptiveRowSize();
		this.switchAnimate();
		this.applyTheme();
	}

	// 定时任务
	timing(obj) {
		let key = setInterval(function () {
			obj.intervalFunction(this, this.state);
		}.bind(this), obj.intervalTime || 5000);
		this.timerKeys.push(key);
	}

	// 调整行
	adaptiveRowSize() {
		const { fontSize, pageSize } = this.newProps;
		let node = this.refs.body;
		let title = node.getElementsByClassName('rc-table-title')[0] || { offsetHeight: 0 };
		let thead = node.getElementsByClassName('rc-table-thead')[0];
		this.cHeight = node.offsetHeight - title.offsetHeight - 20;
		let trHeight = (this.cHeight) / (this.rowCount);
		let trFontSize = pageSize ? `${fontSize/.6 > trHeight ? trHeight * .6 : fontSize}px` : `${trHeight * .6}px`;
		// let trFontSize = `${fontSize}px`;
		thead.style.fontSize = trFontSize;
		if(thead.getElementsByTagName('th').length == 0) return; 
		thead.getElementsByTagName('th')[0].style.height = `${trHeight}px` ;
		let count = this.state.data.length;
		if (count == 0) { return; }
		// let trs = node.getElementsByClassName('fade-enter').length == 0 ? (node.getElementsByClassName('rc-table-row')) : node.getElementsByClassName('fade-enter');
		let trs = node.getElementsByClassName('rc-table-row');
		for (let i = 0; i < trs.length; i++) {
			trs[i].style.fontSize = trFontSize;
			trs[i].style.height = `${trHeight}px` ;
		}
	}

	// 切换动画
	switchAnimate() {
		let node = this.refs.body;
		let title = node.getElementsByClassName('rc-table-title')[0] || { offsetHeight: 0 };
		let rows = node.getElementsByClassName('rc-table-row');
		if (rows.length > 0) {
			let cells = rows[0].cells || [];
			let oldTrs = node.getElementsByClassName('fade-leave') || [];
			let firstRow = rows[0];
			let rowHeight = firstRow.offsetHeight;
			let firstRowTop = firstRow.offsetTop + title.offsetHeight;
			let newTds = firstRow.getElementsByTagName('td');
			// 动画效果定位实现部分
			for (let i = 0; i < oldTrs.length; i++) {
				// 先设置旧tr为绝对布局
				oldTrs[i].style.position = 'absolute';
				// 宽度为100%
				oldTrs[i].style.width = '100%';
				// 新tr的位置高度
				let newTrTop = firstRowTop + rowHeight * i;
				// 将旧tr上移覆盖新的tr
				oldTrs[i].style.top = `${newTrTop}px`;
				// 获得旧tds
				let oldTds = oldTrs[i].getElementsByTagName('td');
				for (let j = 0; j < newTds.length; j++) {
					// 设置旧td=新td宽度
					oldTds[j].style.maxWidth = `${newTds[j].offsetWidth}px`;
					oldTds[j].style.minWidth = `${newTds[j].offsetWidth}px`;
					oldTds[j].width = newTds[j].offsetWidth;
					oldTds[j].height = newTds[j].offsetHeight - 2; 
				}
			}
		}
	}

	/**
	 * 根据容器高度分割data展示
	 */
	splitData() {
		const { fontSize, pageSize } = this.newProps;
		var allTitle = document.getElementsByClassName('rc-title')[0] || { offsetHeight: 0 };
		let node = this.refs.body;
		// 存在title与否会导致计算高度不一致，这里做一个差异补偿
		// let nHeight = (node.offsetHeight==window.innerHeight?
		// 	(allTitle.offsetHeight>0?(node.offsetHeight-allTitle.offsetHeight):node.offsetHeight):
		// 	(allTitle.offsetHeight==0?window.innerHeight:node.offsetHeight));

		let nHeight = node.offsetHeight;
		let title = node.getElementsByClassName('rc-table-title')[0] || { offsetHeight: 0 };
		let thead = node.getElementsByClassName('rc-table-thead')[0];
		this.cHeight = nHeight - title.offsetHeight;
		this.cWidth = node.offsetWidth;
		this.rowCount = pageSize ? (pageSize + 1) : Math.round(this.cHeight / (fontSize / .6)); // 这个rowCount是包含了head的
		this.rowHeight = this.cHeight / this.rowCount;
		let a = this.newProps.data;
		let result = [];
		let j = 0;
		for (let i = 0; i < a.length; i = i + j) {
			let arr = [];
			for (j = 0; j < this.rowCount-1 && a[i + j]; j++) { // rowCount需要减掉head
				arr.push(a[i + j]);
			}
			result.push(arr);
		}

		this.dataArr = result;
		this.dataIndex = 0;
	}

	setRefresh() {
		this.changeData();
		if (this.dataArr.length > 1) {
			this.timing({
				intervalFunction: function () {
					this.changeData();
				}.bind(this),
				intervalTime: this.newProps.refreshInterval * 1000 || 5000
			});
		}
	}

	changeData() {
		this.setState({
			data: this.dataArr[this.dataIndex] || []
		}, () => {
			this.onShow();
			this.dataIndex++;
			if (this.dataIndex >= this.dataArr.length) {
				this.dataIndex = 0
			}
		});
	}

	clearInterval() {
		for (let index in this.timerKeys) {
			clearInterval(this.timerKeys[index]);
			this.timerKeys.splice(index, 1);
		}
	}

	componentWillMount() {
	}
	componentDidMount() {
		this.initSort();
		this.sortData(this.newProps.data);
		this.splitData();
		this.setRefresh();
	}
	componentWillUnmount() {
		this.clearInterval();
	}
	componentWillReceiveProps(nextProps) {
		if (isEqual(nextProps.data, this.newProps.data)) {
			return;
		}
		this.newProps = nextProps;
		this.columns = this.setColumnsRender(this.newProps.columns);
		this.clearInterval();
		this.initSort();
		this.sortData(this.newProps.data);
		this.splitData();
		this.setRefresh();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}
	getBodyWrapper(body) {
		return (
			<Animate transitionName="fade" component="tbody" className={body.props.className}
				transitionAppear={true}
				transitionLeave={true}
			>
				{body.props.children}
			</Animate>
		);
	}

	getTitle() {
		const { title } = this.newProps;
		return title;
	}

	applyTheme() {
		let { themeConfig } = this.newProps;
		themeConfig = themeConfig || {
			head: {},
			stripeRows: [],
			cells: {}
		};
		let { head, stripeRows, cells } = themeConfig;
		let node = this.refs.body;
		let table = node.getElementsByClassName('rc-table')[0];

		let thCells = table.getElementsByTagName('th');

        for(let j = 0; j < thCells.length; j++) {
			let cell = thCells[j];
			for(let k in head) {
				cell.style[k] = head[k];
			}
		}

		let tbody = table.getElementsByTagName('tbody')[0];
		let rows = tbody.getElementsByTagName('tr');

		for(let j = 0; j < rows.length; j++) {
			let tdCells = rows[j].getElementsByTagName('td');
			for(let i = 0; i < tdCells.length; i++) {
				let cell = tdCells[i];
				for(let k in cells) {
					cell.style[k] = cells[k];
				}
				if(stripeRows && stripeRows.length > 0) {
					cell.style.backgroundColor = stripeRows[j%2];
				}
			}
		}
	}

	render() {
		const { fontSize } = this.newProps;
		return (
			<div ref='body' style={{ height: '100%', overflow: 'hidden', fontSize: fontSize, padding: '0px' }}>
				<Table
					prefixCls={this.newProps.prefixCls || 'rc-table'}
					className={this.newProps.className}
					useFixedHeader={this.newProps.useFixedHeader || false}
					scroll={{ x: false, y: this.newProps.scroll } || { x: false, y: false }}
					expandIconAsCell={this.newProps.expandIconAsCell || false}
					expandIconColumnIndex={this.newProps.expandIconColumnIndex || 0}
					rowKey={this.newProps.rowKey || 'key'}
					rowClassName={this.newProps.rowClassName || function () { }}
					rowRef={this.newProps.rowRef || function () { }}
					defaultExpandedRowKeys={this.newProps.defaultExpandedRowKeys || []}
					expandedRowKeys={this.newProps.expandedRowKeys || []}
					defaultExpandAllRows={this.newProps.defaultExpandAllRows || false}
					onExpandedRowsChange={this.newProps.onExpandedRowsChange || function () { }}
					onExpand={this.newProps.onExpand || function () { }}
					expandedRowClassName={this.newProps.expandedRowClassName || function () { }}
					indentSize={this.newProps.indentSize || 15}
					onRowClick={this.newProps.onRowClick || function () { }}
					onRowDoubleClick={this.newProps.onRowDoubleClick || function () { }}
					onRowMouseEnter={this.newProps.onRowMouseEnter || function () { }}
					onRowMouseLeave={this.newProps.onRowMouseLeave || function () { }}
					showHeader={this.newProps.showHeader || true}
					title={this.getTitle()}
					footer={this.newProps.footer}
					emptyText={this.newProps.emptyText || ''}
					columns={this.columns || []}
					data={this.state.data || []}
					getBodyWrapper={this.getBodyWrapper}
					state={this.state}
					headerRowsStyle={this.newProps.headerRowsStyle}
					rowsStyle={this.newProps.rowsStyle}
				/>
			</div>
		);
	}
}
export default TableModel;
