# Form Error Handling System - Usage Guide

## Overview
This guide explains how to use the newly implemented error handling system for POST request forms in your application.

## System Components

### 1. Alert Component (`components/ui/Alert.tsx`)
A reusable alert banner with variants: success, error, warning, info.

**Features:**
- Auto-dismiss functionality
- Manual close button
- Material Icons integration
- Dark mode support

**Usage:**
```tsx
import { Alert } from "@/components/ui";

<Alert
  variant="error"
  message="Login failed. Please try again."
  onClose={clearAlert}
  autoDismiss={false}
/>
```

### 2. Form Error Handler Hook (`hooks/useFormErrorHandler.ts`)
A custom hook that manages form errors and alert states.

**Features:**
- Maps API validation errors to form fields
- Manages alert banner state
- Handles both field-level and general errors
- Success message handling

**Usage:**
```tsx
import { useFormErrorHandler } from "@/hooks/useFormErrorHandler";

const { alert, handleError, handleSuccess, clearAlert } = 
  useFormErrorHandler<YourFormData>(setError);
```

### 3. Enhanced Mutation Hook Pattern
Mutations now accept `onSuccess` and `onError` callbacks.

## Complete Implementation Example

Here's how the login form implements the error handling system:

```tsx
"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { LoginFormData, loginSchema } from "@/validations/auth.validations";
import { useForm } from "react-hook-form";
import { FormInput, Alert } from "@/components/ui";
import { useLoginMutation } from "@/hooks/mutations/useAuthMutations";
import { useFormErrorHandler } from "@/hooks/useFormErrorHandler";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export default function LoginPage() {
  const router = useRouter();
  
  // 1. Setup form with validation
  const { register, handleSubmit, formState: { errors }, setError } = 
    useForm<LoginFormData>({
      resolver: yupResolver(loginSchema),
    });

  // 2. Setup error handler
  const { alert, handleError, handleSuccess, clearAlert } = 
    useFormErrorHandler<LoginFormData>(setError);

  // 3. Setup mutation with callbacks
  const { mutate, isPending } = useLoginMutation({
    onSuccess: (response) => {
      handleSuccess("Login successful! Redirecting...");
      
      if (response.data?.token) {
        setCookie('auth_token', response.data.token);
      }
      
      setTimeout(() => {
        router.push('/');
      }, 1500);
    },
    onError: (error) => {
      handleError(error);
    },
  });

  // 4. Submit handler
  const onSubmit = (data: LoginFormData) => {
    clearAlert();
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 5. Display alert banner */}
      {alert.isVisible && (
        <Alert
          variant={alert.variant}
          message={alert.message}
          onClose={clearAlert}
          autoDismiss={alert.variant === "success"}
        />
      )}

      {/* Form fields with error prop */}
      <FormInput
        label="Email"
        error={errors.email_or_phone}
        {...register("email_or_phone")}
      />
      
      <button type="submit" disabled={isPending}>
        {isPending ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}
```

## How Error Handling Works

### Error Flow Diagram

```
API Response Error
    ↓
ApiError thrown (lib/api/client.ts)
    ↓
Caught by mutation onError
    ↓
handleError() processes error
    ↓
    ├─→ Has validation_errors?
    │   ├─→ YES: Map to form fields via setError()
    │   │        + Show alert banner
    │   └─→ NO:  Show general error alert
    │
    └─→ Display in UI
```

### Error Types Handled

1. **Field Validation Errors** (from API)
   - Mapped to specific form fields
   - Displayed inline under each field
   - General message shown in alert banner

2. **General API Errors**
   - Network errors
   - Server errors (500, 404, etc.)
   - Authentication errors
   - Displayed in alert banner only

3. **Success Messages**
   - Displayed in success alert banner
   - Auto-dismisses after 3 seconds

## Applying to Other Forms

### Step 1: Update/Create the Mutation Hook

```tsx
// hooks/mutations/useYourMutations.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { YourFormData } from "@/validations/your.validations";
import { ApiResponse } from "@/types/api.types";

interface YourResponse {
  // Define your response type
}

export function useYourMutation(
  options?: Omit<
    UseMutationOptions<ApiResponse<YourResponse>, Error, YourFormData>,
    "mutationFn"
  >
) {
  return useMutation({
    mutationFn: (data: YourFormData) => 
      apiClient.post<ApiResponse<YourResponse>>('/your-endpoint', data),
    ...options,
  });
}
```

### Step 2: Update Your Form Component

```tsx
"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, FormInput } from "@/components/ui";
import { useFormErrorHandler } from "@/hooks/useFormErrorHandler";
import { useYourMutation } from "@/hooks/mutations/useYourMutations";
import { yourSchema, YourFormData } from "@/validations/your.validations";

export default function YourForm() {
  const { register, handleSubmit, formState: { errors }, setError } = 
    useForm<YourFormData>({
      resolver: yupResolver(yourSchema),
    });

  const { alert, handleError, handleSuccess, clearAlert } = 
    useFormErrorHandler<YourFormData>(setError);

  const { mutate, isPending } = useYourMutation({
    onSuccess: (response) => {
      handleSuccess("Success message!");
      // Handle success (redirect, reset form, etc.)
    },
    onError: (error) => {
      handleError(error);
    },
  });

  const onSubmit = (data: YourFormData) => {
    clearAlert();
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {alert.isVisible && (
        <Alert
          variant={alert.variant}
          message={alert.message}
          onClose={clearAlert}
          autoDismiss={alert.variant === "success"}
        />
      )}
      
      {/* Your form fields */}
      <FormInput
        error={errors.fieldName}
        {...register("fieldName")}
      />
      
      <button type="submit" disabled={isPending}>
        Submit
      </button>
    </form>
  );
}
```

## API Error Response Format

The system expects errors in this format (already configured in `lib/api/client.ts`):

```json
{
  "meta": {
    "message": "Validation failed",
    "code": 422,
    "error": true,
    "validation_errors": {
      "email_or_phone": ["Invalid email address"],
      "password": ["Password is too short"]
    }
  }
}
```

## Customization Options

### Alert Variants
- `success` - Green, check icon
- `error` - Red, error icon
- `warning` - Amber, warning icon
- `info` - Blue, info icon

### Auto-dismiss Configuration
```tsx
<Alert
  variant="success"
  message="Success!"
  autoDismiss={true}
  dismissAfter={5000} // milliseconds
/>
```

### Custom Alert Styling
```tsx
<Alert
  variant="error"
  message="Error!"
  className="mb-4 shadow-lg"
/>
```

## Best Practices

1. **Always clear alerts before submission**
   ```tsx
   const onSubmit = (data) => {
     clearAlert(); // Clear previous alerts
     mutate(data);
   };
   ```

2. **Use auto-dismiss for success messages**
   ```tsx
   autoDismiss={alert.variant === "success"}
   ```

3. **Disable submit button during loading**
   ```tsx
   <button type="submit" disabled={isPending}>
   ```

4. **Show loading state**
   ```tsx
   {isPending ? "Loading..." : "Submit"}
   ```

5. **Redirect after success with delay**
   ```tsx
   onSuccess: (response) => {
     handleSuccess("Success!");
     setTimeout(() => router.push('/dashboard'), 1500);
   }
   ```

## Forms Ready to Migrate

The following forms can now use this error handling system:

- ✅ **Login Form** - Already implemented
- 🔲 Register Form (`app/(auth)/auth/register/page.tsx`)
- 🔲 Forgot Password Form (`app/(auth)/auth/forgot-password/page.tsx`)
- 🔲 Reset Password Form (`app/(auth)/auth/reset-password/page.tsx`)
- 🔲 Change Password Form (`app/(auth)/auth/change-password/page.tsx`)

## Troubleshooting

### Field errors not showing
- Ensure field names in validation schema match API response field names
- Check that `setError` is passed to `useFormErrorHandler`

### Alert not displaying
- Verify `alert.isVisible` is true
- Check that `handleError` or `handleSuccess` is called in mutation callbacks

### TypeScript errors
- Ensure your form data type is passed to generic: `useFormErrorHandler<YourFormData>`
- Check that mutation response types are defined correctly

