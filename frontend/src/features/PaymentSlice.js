import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCreatePayment = createAsyncThunk('payment/fetchCreatePayment', async (data, {rejectWithValue}) => {
    try {
        const response = await fetch(`/api/create/payment/${data.id}/`, {
            method: 'POST',
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

export const fetchGetPayment = createAsyncThunk('payment/fetchGetPayment', async (id, {rejectWithValue}) => {
    try {
        const response = await fetch(`/api/payment/${id}/`, {
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

export const fetchListPayment = createAsyncThunk('payment/fetchListPayment', async (id, {rejectWithValue}) => {
    try {
        const response = await fetch(`/api/list/payment/${id}/`, {
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
    },
    reducers: {
        resetPayment: (state) => {
            state.payment = {};
            state.paymentStatus = 'idle';
            state.paymentError = null;
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
    }
})

export const { resetPayment } = paymentSlice.actions

export default paymentSlice.reducer