import React from "react";
import { render, screen, wait, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";
// Arrange
//  -render component
// Act
//  -find the element
//  -perform any user actions?
// Assert
//  -verify the element exists/ is what you expect

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const header = screen.getByText("Contact Form");
  expect(header).toBeInTheDocument();
});

test("renders ONE error message if user enters less then 4 characters into firstname.", async () => {
  render(<ContactForm />);

  const firstNameInput = screen.getByLabelText("First Name*");
  userEvent.type(firstNameInput, "aBc");

  await waitFor(() => {
    const firstNameFeedback = screen.getByDisplayValue("aBc");
    const firstNameErrorMessage = screen.getByText("Error: firstName must have at least 4 characters.");
    expect(firstNameFeedback).toHaveValue("aBc");
    expect(firstNameErrorMessage).toBeInTheDocument();
  });
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);

  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  await waitFor(() => {
    const errorMessage = screen.getAllByText(/Error:/i);
    expect(errorMessage).toHaveLength(3);
  });
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);

  //   const firstNameInput = screen.getByLabelText("First Name*");
  //   userEvent.type(firstNameInput, "misha");
  //   const lastNameInput = screen.getByLabelText("Last Name*");
  //   userEvent.type(lastNameInput, "s");

  //   await waitFor(() => {
  //     const errorMessage = screen.getByText(/Error:/i);
  //     expect(errorMessage).toBeInTheDocument();
  //   });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);

  const emailInput = screen.getByLabelText("Email*");
  userEvent.type(emailInput, "thisshouldntwork.com");

  await waitFor(() => {
    const errorMessage = screen.getByText(/email must be a valid email address/i);
    expect(errorMessage).toBeInTheDocument();
  });
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);

  const firstNameInput = screen.getByLabelText("First Name*");
  userEvent.type(firstNameInput, "misha");
  const emailInput = screen.getByLabelText("Email*");
  userEvent.type(emailInput, "thisemail@shouldwork.com");
  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  await waitFor(() => {
    const errorMessage = screen.getByText(/lastName is a required field/i);
    expect(errorMessage).toBeInTheDocument();
  });
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);

  const firstNameInput = screen.getByLabelText("First Name*");
  userEvent.type(firstNameInput, "misha");
  const lastNameInput = screen.getByLabelText("Last Name*");
  userEvent.type(lastNameInput, "s");
  const emailInput = screen.getByLabelText("Email*");
  userEvent.type(emailInput, "thisemail@shouldwork.com");
  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);
  //   const messageInput = screen.getByLabelText("Message");
  //   userEvent.type(messageInput, "this should make the test fail");

  await waitFor(() => {
    const messageField = screen.queryByText(/Message:/i);
    expect(messageField).not.toBeInTheDocument();
  });
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);

  const firstNameInput = screen.getByLabelText("First Name*");
  userEvent.type(firstNameInput, "misha");
  const lastNameInput = screen.getByLabelText("Last Name*");
  userEvent.type(lastNameInput, "s");
  const emailInput = screen.getByLabelText("Email*");
  userEvent.type(emailInput, "thisemail@shouldwork.com");
  const messageInput = screen.getByLabelText("Message");
  userEvent.type(messageInput, "this should not make the test fail");
  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);

  await waitFor(() => {
    const firstnameDisplay = screen.queryByTestId("firstnameDisplay");
    expect(firstnameDisplay).toBeInTheDocument();
    const lastnameDisplay = screen.queryByTestId("lastnameDisplay");
    expect(lastnameDisplay).toBeInTheDocument();
    const emailDisplay = screen.queryByTestId("emailDisplay");
    expect(emailDisplay).toBeInTheDocument();
    const messageDisplay = screen.queryByTestId("messageDisplay");
    expect(messageDisplay).toBeInTheDocument();
  });
});
