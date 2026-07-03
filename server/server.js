require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { refreshOverdueFlags } = require("./utils/overdueChecker");

const PORT = process.env.PORT || 5000;
const OVERDUE_CHECK_INTERVAL =
  Number(process.env.OVERDUE_CHECK_INTERVAL_MS) || 60 * 60 * 1000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  refreshOverdueFlags().catch((error) => {
    console.error("Initial overdue check failed:", error.message);
  });

  setInterval(() => {
    refreshOverdueFlags().catch((error) => {
      console.error("Scheduled overdue check failed:", error.message);
    });
  }, OVERDUE_CHECK_INTERVAL);
});
