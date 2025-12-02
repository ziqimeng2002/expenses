// File: /api/expenses/route.js

let expenses = []; // In-memory storage (resets on cold start)

export async function GET() {
  return new Response(
    JSON.stringify({
      success: true,
      data: expenses
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, description, category, date } = body;

    // Error handling for missing fields
    const missing = [];
    if (amount === undefined) missing.push("amount");
    if (!description) missing.push("description");
    if (!category) missing.push("category");
    if (!date) missing.push("date");

    if (missing.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required fields: ${missing.join(", ")}`
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const newExpense = {
      id: crypto.randomUUID(),
      amount,
      description,
      category,
      date
    };

    expenses.push(newExpense);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Expense added successfully",
        data: newExpense
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid JSON body"
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
