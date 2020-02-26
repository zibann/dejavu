// @flow

import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Button, Checkbox, Dropdown } from 'antd';

import {
	getColumns,
	getVisibleColumns,
	getNestedVisibleColumns,
	getNestedColumns,
  getSortedColumns,
} from '../../reducers/mappings';
import { getIsShowingNestedColumns } from '../../reducers/nestedColumns';
import {
	setVisibleColumns,
	setNestedVisibleColumns,
  setSortedColumns,
} from '../../actions/mappings';
import colors from '../theme/colors';

import Checkboxes from './Checkboxes';

const { Group } = Checkbox;

type Props = {
	columns: string[],
	nestedColumns: string[],
	visibleColumns: string[],
	setVisibleColumns: (string[]) => void,
	nestedVisibleColumns: string[],
	isShowingNestedColumns: boolean,
	setNestedVisibleColumns: (string[]) => void,
};

type State = {
	showDropdown: boolean,
};
class ShowHideColumns extends Component<Props, State> {
	showHideDropdownNode = createRef();

	state = {
		showDropdown: false,
	};

	componentDidMount() {
		document.addEventListener(
			'mousedown',
			this.handleDropdownOutsideClick,
			false,
		);

    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.handleChangeCheckboxOrder = this.handleChangeCheckboxOrder.bind(this);
	}

	componentWillUnmount() {
		document.removeEventListener(
			'mousedown',
			this.handleDropdownOutsideClick,
			false,
		);
	}
  
	handleDropdownOutsideClick = (e: any) => {
		if (
			this.showHideDropdownNode &&
			this.showHideDropdownNode.current &&
			this.showHideDropdownNode.current.contains &&
			this.showHideDropdownNode.current.contains(e.target)
		) {
			return;
		}

		if (e.target.id === 'show-hide-button') {
			return;
		}

		this.setState({
			showDropdown: false,
		});
	};

	handleSelectAll = e => {
		const { checked } = e.target;
		const {
			columns,
			nestedColumns,
			isShowingNestedColumns,
			setNestedVisibleColumns: onSetNestedVisibleColumns,
			setVisibleColumns: onSetVisibleColumns,
		} = this.props;
		let visibleColumns;

		if (checked) {
			visibleColumns = isShowingNestedColumns ? nestedColumns : columns;
		} else {
			visibleColumns = [];
		}

		if (isShowingNestedColumns) {
			onSetNestedVisibleColumns(visibleColumns);
		} else {
			onSetVisibleColumns(visibleColumns);
		}
	};

	handleVisibleColumnsChange = visibleColumns => {
		const metaIndex = visibleColumns.indexOf('_index');
		const metaType = visibleColumns.indexOf('_type');
		let currentVissibleColums = visibleColumns;

		// to append meta fields at the beginning of array
		if (metaType > -1 && metaType > 1) {
			currentVissibleColums.splice(metaType, 1);
			currentVissibleColums = ['_type', ...currentVissibleColums];
		}

		if (metaIndex > -1 && metaIndex > 1) {
			currentVissibleColums.splice(metaIndex, 1);
			currentVissibleColums = ['_index', ...currentVissibleColums];
		}

		if (this.props.isShowingNestedColumns) {
			this.props.setNestedVisibleColumns(currentVissibleColums);
		} else {
			this.props.setVisibleColumns(currentVissibleColums);
		}
	};

	toggleDropDown = () => {
		this.setState(prevState => ({
			showDropdown: !prevState.showDropdown,
		}));
	};

	render() {
		const {
			columns: allColumns,
			nestedColumns: allNestedColumns,
			visibleColumns,
			isShowingNestedColumns,
			nestedVisibleColumns,
		} = this.props;
		const { showDropdown } = this.state;
		const allMappingColumns = isShowingNestedColumns
			? allNestedColumns
			: allColumns;
		const columns = isShowingNestedColumns
			? nestedVisibleColumns
			    : visibleColumns;

		return (
			<Dropdown
				ref={this.showHideDropdownNode}
				placement="bottomRight"
				overlay={
					<div
						css={{
							background: colors.white,
							borderRadius: 4,
							padding: 10,
							boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
							maxHeight: '75vh',
							overflowY: 'auto',
						}}
						ref={this.showHideDropdownNode}
					>
						<Checkbox
							checked={
								columns.length === allMappingColumns.length
							}
							indeterminate={
								columns.length < allMappingColumns.length &&
								columns.length
							}
							css={{
								marginBottom: '5px !important',
								fontWeight: 'bold !important',
							}}
							onChange={this.handleSelectAll}
						>
							Select All
						</Checkbox>
            {this.renderCheckboxes()}
					</div>
				}
				visible={showDropdown}
				trigger={['click']}
				onClick={this.toggleDropDown}
			>
				<Button
					css={{
						marginLeft: '5px',
						'.anticon': {
							fontSize: '18px !important',
						},
					}}
					id="show-hide-button"
					icon="setting"
				/>
			</Dropdown>
		);
	}

  getOptions(options) {
    // https://github.com/Microsoft/TypeScript/issues/7960
    return (options).map(option => {
      if (typeof option === 'string') {
        return {
          label: option,
          value: option,
        } 
      }
      return option;
    });
  }
  

  renderCheckboxes() {
		const {
			columns: allColumns,
			nestedColumns: allNestedColumns,
			isShowingNestedColumns,
		} = this.props;
    
		const allMappingColumns = isShowingNestedColumns
			? allNestedColumns
			    : allColumns;

    let columns = []
    if (Array.isArray(this.props.sortedColumns) && this.props.sortedColumns.length) {
      columns = this.props.sortedColumns
    } else {
      columns = allMappingColumns
    }

    let options = this.getOptions(columns)
    let selectedColumns = this.getSelectedColumns();

    return (
      <Checkboxes
        options={options}
        selectedColumns={selectedColumns}
        toggleCheckbox={this.toggleCheckbox}
        onChangeOrder={this.handleChangeCheckboxOrder}
      />
    )
    
  }

  getSelectedColumns() {
    let selectedColumns = []
    if (this.props.isShowingNestedColumns) {
      selectedColumns = [...this.props.nestedVisibleColumns]
    } else {
      selectedColumns = [...this.props.visibleColumns]
    }
    return selectedColumns
  }

  toggleCheckbox(e, option) {

    let selectedColumns = this.getSelectedColumns();
    const optionIndex = selectedColumns.indexOf(option.value);
    if (optionIndex === -1) {
      let index = this.props.sortedColumns.indexOf(option.value)
      selectedColumns.splice(index, 0, option.value);
    } else {
      selectedColumns.splice(optionIndex, 1);
    }

    this.handleVisibleColumnsChange(selectedColumns)
  }

  handleChangeCheckboxOrder(options) {

    let columns = options.map(option => {
      return option.value
    })

    let selectedColumns = this.getSelectedColumns();

    selectedColumns.sort(function(a, b) {
      return columns.indexOf(a) - columns.indexOf(b);
    });

    this.handleVisibleColumnsChange(selectedColumns)
    this.props.setSortedColumns(columns);
    
  }
}

const mapStateToProps = state => ({
	columns: getColumns(state),
	nestedColumns: getNestedColumns(state),
	visibleColumns: getVisibleColumns(state),
	nestedVisibleColumns: getNestedVisibleColumns(state),
	isShowingNestedColumns: getIsShowingNestedColumns(state),
  sortedColumns: getSortedColumns(state),
});

const mapDispatchToProps = {
	setVisibleColumns,
	setNestedVisibleColumns,
  setSortedColumns,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowHideColumns);
