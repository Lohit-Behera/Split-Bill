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
        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        return rejectWithValue(error.message);
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
        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const fetchListPayment = createAsyncThunk('payment/fetchListPayment', async (data, {rejectWithValue}) => {
    try {
        const response = await fetch(`/api/list/payment/${data.id}/${data.page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            data
        });
        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const fetchDeletePayment = createAsyncThunk('payment/delete=', async (id, {rejectWithValue}) => {
    try {
        const response = await fetch(`/api/delete/payment/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})

export const fetchUpdatePayment = createAsyncThunk('payment/update', async (data, {rejectWithValue}) => {
    try {
        const response = await fetch(`/api/update/payment/${data.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData);
        }

        const result = await response.json();
        return result;
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