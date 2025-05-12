import { Suspense, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const RegisterSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isPending] = useTransition();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    try {
      const response = await fetch(
        "https://ws-be-111659801199.asia-south2.run.app/api/v1/authentication/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values }),
        }
      );

      if (!response.ok) throw new Error("Signup failed");

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigateToSignup = () => {
    navigate("/login");
  };

  return (
    <Suspense>
      <CardWrapper
        headerLabel="Create an account"
        backButtonLabel="Already have an account?"
        backButtonHref="/auth/login"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="jonhdoe"
                        type="text"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full hover:cursor-pointer"
              disabled={isPending}
            >
              Sign up
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <button
            onClick={handleNavigateToSignup}
            className="text-sm mt-2 hover:cursor-pointer"
          >
            Already have an account?
          </button>
        </div>
      </CardWrapper>
    </Suspense>
  );
};

export default RegisterForm;
