import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./Proxy";

export const fetchCreatePayment = createAsyncThunk('payment/fetchCreatePayment', async (paymentData, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.post(`${baseUrl}/api/create/payment/${paymentData.id}/`, paymentData, config);
        return data;

    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const fetchGetPayment = createAsyncThunk('payment/fetchGetPayment', async (id, {rejectWithValue}) => {
   try {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const { data } = await axios.get(`${baseUrl}/api/payment/${id}/`, config);
    return data;
   } catch (error) {
    return rejectWithValue(error.message);
   }
})

export const fetchListPayment = createAsyncThunk('payment/fetchListPayment', async (paymentData, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const { data } = await axios.get(`${baseUrl}/api/list/payment/${paymentData.id}/${paymentData.page}`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const fetchDeletePayment = createAsyncThunk('payment/delete=', async (id, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.delete(`${baseUrl}/api/delete/payment/${id}/`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const fetchUpdatePayment = createAsyncThunk('payment/update', async (paymentData, {rejectWithValue}) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.put(`${baseUrl}/api/update/payment/${paymentData.id}/`, paymentData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        payment: {},
        paymentStatus: 'idle',
        paymentError: null,

        getPayment: [],
        getPaymentStatus: 'idle',
        getPaymentError: null,

        paymentList: [],
        paymentListStatus: 'idle',
        paymentListError: null,

        deletePayment: null,
        deletePaymentStatus: 'idle',
        deletePaymentError: null,

        updatePayment: null,
        updatePaymentStatus: 'idle',
        updatePaymentError: null
    },
    reducers: {
        resetPayment: (state) => {
            state.payment = {};
            state.paymentStatus = 'idle';
            state.paymentError = null;
        },
        resetDeletePayment: (state) => {
            state.deletePayment = null;
            state.deletePaymentStatus = 'idle';
            state.deletePaymentError = null;
        },
        resetUpdatePayment: (state) => {
            state.updatePayment = null;
            state.updatePaymentStatus = 'idle';
            state.updatePaymentError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreatePayment.pending, (state) => {
                state.paymentStatus = 'loading';
            })
            .addCase(fetchCreatePayment.fulfilled, (state, action) => {
                state.paymentStatus = 'succeeded';
                state.payment = action.payload;
            })
            .addCase(fetchCreatePayment.rejected, (state, action) => {
                state.paymentStatus = 'failed';
                state.paymentError = action.payload;
            })


            .addCase(fetchGetPayment.pending, (state) => {
                state.getPaymentStatus = 'loading';
            })
            .addCase(fetchGetPayment.fulfilled, (state, action) => {
                state.getPaymentStatus = 'succeeded';
                state.getPayment = action.payload;
            })
            .addCase(fetchGetPayment.rejected, (state, action) => {
                state.getPaymentStatus = 'failed';
                state.getPaymentError = action.payload;;
            })


            .addCase(fetchListPayment.pending, (state) => {
                state.paymentListStatus = 'loading';
            })
            .addCase(fetchListPayment.fulfilled, (state, action) => {
                state.paymentListStatus = 'succeeded';
                state.paymentList = action.payload;
            })
            .addCase(fetchListPayment.rejected, (state, action) => {
                state.paymentListStatus = 'failed';
                state.paymentListError = action.payload;;
            })


            .addCase(fetchDeletePayment.pending, (state) => {
                state.deletePaymentStatus = 'loading';
            })
            .addCase(fetchDeletePayment.fulfilled, (state, action) => {
                state.deletePaymentStatus = 'succeeded';
                state.deletePayment = action.payload;
            })
            .addCase(fetchDeletePayment.rejected, (state, action) => {
                state.deletePaymentStatus = 'failed';
                state.deletePaymentError = action.payload;;
            })


            .addCase(fetchUpdatePayment.pending, (state) => {
                state.updatePaymentStatus = 'loading';
            })
            .addCase(fetchUpdatePayment.fulfilled, (state, action) => {
                state.updatePaymentStatus = 'succeeded';
                state.updatePayment = action.payload;
            })
            .addCase(fetchUpdatePayment.rejected, (state, action) => {
                state.updatePaymentStatus = 'failed';
                state.updatePaymentError = action.payload;;
            })
    }
})

export const { resetPayment, resetDeletePayment, resetUpdatePayment } = paymentSlice.actions

export default paymentSlice.reducer