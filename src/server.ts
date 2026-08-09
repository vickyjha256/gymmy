import "dotenv/config";
import app from "./app";
import { startMembershipStatusJob } from "./jobs/membershipStatus.job";


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


startMembershipStatusJob();