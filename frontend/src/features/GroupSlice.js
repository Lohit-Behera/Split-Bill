import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./Proxy";

export const fetchGroupCreate = createAsyncThunk('group/fetchGroupCreate', async (groupData, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const { data: result } = await axios.put(`${baseUrl}/api/group/create/`, groupData, config);
        return result;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})
  
export const fetchGetGroup = createAsyncThunk('group/fetchGetGroup', async (id, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.get(`${baseUrl}/api/group/${id}/`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const fetchGroupList = createAsyncThunk('group/fetchGroupList', async (keyword = '', {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.get(`${baseUrl}/api/group/list/${keyword}`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const fetchGroupDelete = createAsyncThunk('group/fetchGroupDelete', async (id, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const { data } = await axios.delete(`${baseUrl}/api/delete/group/${id}/`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const fetchGroupNameUpdate = createAsyncThunk('group/name/update', async (groupData, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.put(`${baseUrl}/api/update/group/name/${groupData.id}/`, groupData, config);
        return groupData;
    } catch (error) {
        return rejectWithValue(error.message);
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
        deleteGroupError: null,

        groupNameUpdate: null,
        groupNameUpdateStatus: 'idle',
        groupNameUpdateError: null
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
        },
        resetGroupNameUpdate: (state) => {
            state.groupNameUpdate = null;
            state.groupNameUpdateStatus = 'idle';
            state.groupNameUpdateError = null;
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

            .addCase(fetchGroupNameUpdate.pending, (state) => {
                state.groupNameUpdateStatus = 'loading';
            })
            .addCase(fetchGroupNameUpdate.fulfilled, (state, action) => {
                state.groupNameUpdateStatus = 'succeeded';
                state.groupNameUpdate = action.payload;
            })
            .addCase(fetchGroupNameUpdate.rejected, (state, action) => {
                state.groupNameUpdateStatus = 'failed';
                state.groupNameUpdateError = action.payload;
            })
    },
})

export const { resetGroup, resetDeleteGroup, resetGroupNameUpdate } = groupSlice.actions

export default groupSlice.reducer