import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchGroupCreate = createAsyncThunk('group/fetchGroupCreate', async (data, {rejectWithValue}) => {
    try {
        const response = await fetch('/api/group/create/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error);
    }
})

export const fetchGetGroup = createAsyncThunk('group/fetchGetGroup', async (id, {rejectWithValue}) => {
    try {
        const response = await fetch(`/api/group/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;

    } catch (error) {
        return rejectWithValue(error);
    }
})

export const fetchGroupList = createAsyncThunk('group/fetchGroupList', async (data, {rejectWithValue}) => {
    try {
        const response = await fetch('/api/group/list/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const fetchGroupDelete = createAsyncThunk('group/fetchGroupDelete', async (id, {rejectWithValue}) => {
    try {
        const response = await fetch(`/api/delete/group/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        return rejectWithValue(error);
    }
})


const groupSlice = createSlice({
    name: 'group',
    initialState: {
        group: null,
        groupStatus: 'idle',
        groupError: null,

        getGroup: null,
        getGroupStatus: 'idle',
        getGroupError: null,

        getGroupList: [],
        getGroupListStatus: 'idle',
        getGroupListError: null,

        deleteGroup: null,
        deleteGroupStatus: 'idle',
        deleteGroupError: null
    },
    reducers: {
        resetGroup: (state) => {
            state.group = null;
            state.groupStatus = 'idle';
            state.groupError = null;
        },
        resetDeleteGroup: (state) => {
            state.deleteGroup = null;
            state.deleteGroupStatus = 'idle';
            state.deleteGroupError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroupCreate.pending, (state) => {
                state.groupStatus = 'loading';
            })
            .addCase(fetchGroupCreate.fulfilled, (state, action) => {
                state.groupStatus = 'succeeded';
                state.group = action.payload;
            })
            .addCase(fetchGroupCreate.rejected, (state, action) => {
                state.groupStatus = 'failed';
                state.groupError = action.payload;
            })


            .addCase(fetchGetGroup.pending, (state) => {
                state.getGroupStatus = 'loading';
            })
            .addCase(fetchGetGroup.fulfilled, (state, action) => {
                state.getGroupStatus = 'succeeded';
                state.getGroup = action.payload;
            })
            .addCase(fetchGetGroup.rejected, (state, action) => {
                state.getGroupStatus = 'failed';
                state.getGroupError = action.payload;
            })

            .addCase(fetchGroupList.pending, (state) => {
                state.getGroupListStatus = 'loading';
            })
            .addCase(fetchGroupList.fulfilled, (state, action) => {
                state.getGroupListStatus = 'succeeded';
                state.getGroupList = action.payload;
            })
            .addCase(fetchGroupList.rejected, (state, action) => {
                state.getGroupListStatus = 'failed';
                state.getGroupListError = action.payload;
            })

            .addCase(fetchGroupDelete.pending, (state) => {
                state.deleteGroupStatus = 'loading';
            })
            .addCase(fetchGroupDelete.fulfilled, (state, action) => {
                state.deleteGroupStatus = 'succeeded';
                state.deleteGroup = action.payload;
            })
            .addCase(fetchGroupDelete.rejected, (state, action) => {
                state.deleteGroupStatus = 'failed';
                state.deleteGroupError = action.payload;
            })
    },
})

export const { resetGroup, resetDeleteGroup } = groupSlice.actions

export default groupSlice.reducer