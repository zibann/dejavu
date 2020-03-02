import _ from 'lodash';
import { MAPPINGS } from '../actions/constants';

const initialState = {
	data: null,
	isLoading: false,
	indexes: [],
	types: [],
	indexTypeMap: {},
	columns: [],
	visibleColumns: [],
	searchableColumns: [],
	typePropertyMapping: {},
	nestedVisibleColumns: [],
	nestedSearchableColumns: [],
	nestedColumns: [],
	termsAggregationColumns: [],
	sortableColumns: [],
	shouldShowNestedSwitch: false,
};

const l = [
	'review_meta.id',
	'review_meta.name',
	'review_meta_confirmed',
	'review_meta.view_count',
	'provider_candidates.formatted_phone_number',
	'date_last_contact',
	'naver_place_id',
	'naver_info.name',
	'naver_place_confirmed',
	'provider_candidates.name',
	'provider_candidates.product_name',
	'provider_candidates.formatted_address',
	'etc',
	'pv_list',
	'product.id',
	'product.name',
	'product.littlehome_only',
	'product.lowest_price',
	'size_operation',
	'product_info',
	'provider_name',
	'sticker',
	'product_open_date',
	'ignore',
];

const mappings = (state = initialState, action) => {
	const {
		data,
		type,
		indexes,
		types,
		indexTypeMap,
		columns,
		searchableColumns,
		typePropertyMapping,
		visibleColumns,
		nestedVisibleColumns,
		nestedSearchableColumns,
		nestedColumns,
		appName,
		termsAggregationColumns,
		sortableColumns,
		shouldShowNestedSwitch,
		searchableColumnsWeights,
		nestedSearchableColumnsWeights,
	} = action;

	switch (type) {
		case MAPPINGS.MAPPINGS_FETCH_REQUEST:
			return {
				...state,
				isLoading: true,
			};
		case MAPPINGS.MAPPINGS_FETCH_SUCCESS:
			return {
				...state,
				data,
				indexes,
				types,
				indexTypeMap,
				isLoading: false,
				columns,
				visibleColumns,
				searchableColumns,
				typePropertyMapping,
				nestedVisibleColumns,
				nestedSearchableColumns,
				nestedColumns,
				termsAggregationColumns,
				sortableColumns,
				shouldShowNestedSwitch,
				searchableColumnsWeights,
				nestedSearchableColumnsWeights,
			};
		case MAPPINGS.MAPPINGS_FETCH_FAILURE:
			return {
				...state,
				isLoading: false,
			};

		case MAPPINGS.SET_VISIBLE_COLUMNS:
			let visibleColumns_ = visibleColumns.slice();

			visibleColumns_ = visibleColumns_.filter(e => {
				return l.indexOf(e) >= 0;
			});

			visibleColumns_.sort((a, b) => {
				if (l.indexOf(a) === -1) {
					if (l.indexOf(b) === -1) {
						return 0;
					}
					return 1;
				}
				if (l.indexOf(b) === -1) {
					if (l.indexOf(a) === -1) {
						return 0;
					}
					return -1;
				}

				if (l.indexOf(a) < l.indexOf(b)) {
					return -1;
				}

				return 1;
			});

			return {
				...state,

				visibleColumns: visibleColumns_,
			};

		// return {
		// 	...state,

		// 	visibleColumns,
		// };

		case MAPPINGS.SET_NESTED_VISIBLE_COLUMNS:
			let nestedVisibleColumns_ = nestedVisibleColumns.slice();

			nestedVisibleColumns_.sort((a, b) => {
				if (l.indexOf(a) === -1) {
					if (l.indexOf(b) === -1) {
						return 0;
					}
					return 1;
				}
				if (l.indexOf(b) === -1) {
					if (l.indexOf(a) === -1) {
						return 0;
					}
					return -1;
				}

				if (l.indexOf(a) < l.indexOf(b)) {
					return -1;
				}

				return 1;
			});

			nestedVisibleColumns_ = nestedVisibleColumns_.filter(e => {
				return l.indexOf(e) >= 0;
			});

			return {
				...state,
				nestedVisibleColumns: nestedVisibleColumns_,
			};
		case MAPPINGS.SET_ARRAY_FIELDS:
			return {
				...state,
				nestedColumns,
				nestedVisibleColumns,
				typePropertyMapping,
				data: {
					[appName]: {
						...state.data[appName],
						nestedProperties: {
							...state.data[appName].nestedProperties,
							...action.nestedMappings,
						},
					},
				},
			};
		default:
			return state;
	}
};

// selectors
const getMappings = state => state.mappings.data;
const getIsLoading = state => state.mappings.isLoading;
const getIndexes = state => state.mappings.indexes;
const getTypes = state => state.mappings.types;
const getIndexTypeMap = state => state.mappings.indexTypeMap;
const getColumns = state => state.mappings.columns;
const getVisibleColumns = state => state.mappings.visibleColumns;
// const getVisibleColumns = state => {

//   const { visibleColumns } = state.mappings;

//   _.pick(visibleColumns, ['created-at', 'date_last_contact'])
//   return columns;

// };

const getSearchableColumns = state => state.mappings.searchableColumns;
const getTypePropertyMapping = state => state.mappings.typePropertyMapping;
const getNestedColumns = state => state.mappings.nestedColumns;
const getNestedVisibleColumns = state => state.mappings.nestedVisibleColumns;
const getNestedSearchableColumns = state =>
	state.mappings.nestedSearchableColumns;
const getTermsAggregationColumns = state =>
	state.mappings.termsAggregationColumns;
const getSortableColumns = state => state.mappings.sortableColumns;
const getShouldShowNestedSwitch = state =>
	state.mappings.shouldShowNestedSwitch;
const getSearchableColumnsWeights = state =>
	state.mappings.searchableColumnsWeights;
const getNesetedSearchableColumnsWeights = state =>
	state.mappings.nestedSearchableColumnsWeights;

export {
	getMappings,
	getIsLoading,
	getIndexes,
	getTypes,
	getIndexTypeMap,
	getColumns,
	getVisibleColumns,
	getSearchableColumns,
	getTypePropertyMapping,
	getNestedColumns,
	getNestedVisibleColumns,
	getNestedSearchableColumns,
	getTermsAggregationColumns,
	getSortableColumns,
	getShouldShowNestedSwitch,
	getSearchableColumnsWeights,
	getNesetedSearchableColumnsWeights,
};

export default mappings;
