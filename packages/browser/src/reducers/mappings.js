import _ from 'lodash';
import { MAPPINGS } from '../actions/constants';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

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
	sortedColumns: [],
	nestedSearchableColumns: [],
	nestedColumns: [],
	termsAggregationColumns: [],
	sortableColumns: [],
	shouldShowNestedSwitch: false,
};

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
		sortedColumns,
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
				visibleColumns: state.visibleColumns || visibleColumns,
				searchableColumns,
				typePropertyMapping,
				nestedVisibleColumns:
					state.nestedVisibleColumns || nestedVisibleColumns,
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
			return {
				...state,
				visibleColumns,
			};
		case MAPPINGS.SET_NESTED_VISIBLE_COLUMNS:
			return {
				...state,
				nestedVisibleColumns,
			};

		case MAPPINGS.SET_SORTED_COLUMNS:
			return {
				...state,
				sortedColumns,
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
const getSortedColumns = state => state.mappings.sortedColumns;
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
	getSortedColumns,
};

const persistConfig = {
	timeout: 0,
	key: 'mappings',
	storage,
	blacklist: [''],
};

const persistedReducer = persistReducer(persistConfig, mappings);

export default persistedReducer;
