export const endpoints = {
    auth: {
        googleLogin: '/auth/client/redirect',
        googleCallback: '/auth/client/callback',
        login: '/auth/login',
        logout: '/auth/logout',
        profile: '/auth/profile',
        register: '/auth/client/register',
        sendOtp: '/auth/send-otp',
        checkOtp: '/auth/check-otp',
        resetPassword: '/auth/reset-password',
        updateProfile: '/auth/client/update-profile',
        changePassword: '/auth/change-password',
    },
    settings: '/client/settings',
    contacts: '/client/contacts',
    orders: '/client/orders',
    wishlist: '/client/products/wishlist',
    cart: {
        add: '/client/carts',
        clear: '/client/carts',
        updateItem: (id: number) => `/client/carts-items/${id}`,
        removeItem: (id: number) => `/client/carts-items/${id}`,
    },
    payment: {
        pay: '/client/payment/pay',
        callback: '/client/payment/callback',
    }
};