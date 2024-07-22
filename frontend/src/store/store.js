import { configureStore } from "@reduxjs/toolkit";

import ModeSlice from "@/features/ModeSlice";
import GroupSlice from "@/features/GroupSlice";
import PaymentSlice from "@/features/PaymentSlice";

const store = configureStore({
    reducer: {
        mode: ModeSlice,
        group: GroupSlice,
        payment: PaymentSlice
    }
})

export default store