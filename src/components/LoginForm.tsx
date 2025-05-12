import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CardWrapper from "./CardWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

const LoginForm = () => {
  const showTwoFactor = false;
  const [error, setError] = useState<string | undefined>("");
  const [isPending] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      const response = await fetch(
        "https://ws-be-111659801199.asia-south2.run.app/api/v1/authentication/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...values }),
        }
      );

      if (!response.ok) throw new Error("Authentication failed");

      // Add this right after a successful login response
      console.log("Response status:", response.status);
      console.log("Response headers:", Array.from(response.headers.entries()));
      // This won't show HTTP-only cookies, but will show any non-HttpOnly ones
      console.log("Current cookies:", document.cookie);

      // Add a verification step to check if the auth worked
      try {
        const verifyResponse = await fetch(
          "https://ws-be-111659801199.asia-south2.run.app/api/v1/authentication/verify",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (verifyResponse.ok) {
          navigate("/game");
        } else {
          setError("Session verification failed");
        }
      } catch (verifyErr) {
        console.error("Verification failed:", verifyErr);
        setError("Unable to verify session");
      }
    } catch (err) {
      console.error(err);
      setError("Authentication failed");
    }
  };

  const handleNavigateToSignup = () => {
    navigate("/signup");
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Already have an account?"
      backButtonHref="/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john.doe@example.com"
                          type="email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="********"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button
                        size={"sm"}
                        variant={"link"}
                        asChild
                        className="px-0 font-normal"
                      ></Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full hover:cursor-pointer"
            disabled={isPending}
          >
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center">
        <button
          onClick={handleNavigateToSignup}
          className="text-sm mt-2 hover:cursor-pointer"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </CardWrapper>
  );
};

export default LoginForm;
