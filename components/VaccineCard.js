import { Box, Container, Heading, Grid, Input, Button, Card } from "theme-ui";
import Icon from "@hackclub/icons";

export default function VaccineCard({ data, mb }) {
  return (
    <Card mb={mb} style={{ maxWidth: "500px", position: "relative" }}>
      <span
        style={{
          position: "absolute",
          bottom: "0px",
          right: "0px",
          transform: "scale(4) translate(-15%, -15%)",
          filter: "opacity(0.1)",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
          <path d="m15.8 45.55-3.6-2.65v-8.85h-2.15q-1.75 0-2.925-1.175Q5.95 31.7 5.95 29.95v-14.9h-.5q-.8-.1-1.3-.675-.5-.575-.5-1.375 0-.9.575-1.475.575-.575 1.475-.575h6.5V7.3H11q-.9 0-1.475-.6-.575-.6-.575-1.5t.575-1.475Q10.1 3.15 11 3.15h6q.9 0 1.475.575.575.575.575 1.475 0 .9-.575 1.5T17 7.3h-1.2v3.65h6.5q.9 0 1.475.575.575.575.575 1.475 0 .8-.5 1.375t-1.3.675h-.5v14.9q0 1.75-1.175 2.925Q19.7 34.05 17.95 34.05H15.8Zm-5.75-15.6h7.9V26.8H14.5q-.55 0-.925-.375T13.2 25.5q0-.55.375-.925t.925-.375h3.45v-3.4H14.5q-.55 0-.925-.375T13.2 19.5q0-.55.375-.925t.925-.375h3.45v-3.15h-7.9Zm20.25 14.9q-1.75 0-2.95-1.2-1.2-1.2-1.2-2.95v-13q0-1.65.4-2.575.4-.925 1.1-1.575 1.45-1.25 1.75-1.775.3-.525.3-1.075v-1.5h-.5q-.8-.1-1.275-.675-.475-.575-.475-1.375 0-.9.6-1.5t1.45-.6h10q.9 0 1.475.6.575.6.575 1.5 0 .8-.475 1.375T39.8 19.2h-.5v1.5q0 .5.375 1.125T41.5 23.7q.75.65 1.05 1.5.3.85.3 2.5v13q0 1.75-1.2 2.95-1.2 1.2-2.95 1.2Zm0-16.15h8.4v-1q0-.8-.475-1.525-.475-.725-1.025-1.325-.8-1-1.15-1.675-.35-.675-.35-1.875v-2.1h-2.4v2.1q0 1.1-.325 1.8t-1.125 1.7q-.5.65-1.025 1.35-.525.7-.525 1.55Zm0 12h8.4v-3.4h-8.4Z" />
        </svg>
      </span>
      <Heading style={{ fontSize: "28px" }}>SMART Health Card</Heading>
      <Grid columns={[1, 2, 2]} mt="4" mb="4">
        <Box>
          <Heading
            mb="0"
            mt="0"
            variant="subheadline"
            style={{ fontSize: "18px", textTransform: "uppercase" }}
          >
            Name
          </Heading>
          <Heading
            mb="0"
            mt="0"
            variant="subtitle"
            style={{ fontSize: "22px" }}
          >
            {data?.record?.verified?.record?.name}
          </Heading>
        </Box>
        <Box>
          <Heading
            mb="0"
            mt="0"
            variant="subheadline"
            style={{ fontSize: "18px", textTransform: "uppercase" }}
          >
            Issuer
          </Heading>
          <Heading
            mb="0"
            mt="0"
            variant="subtitle"
            style={{ fontSize: "22px" }}
          >
            {data?.record?.verified?.record?.issuer?.name}
          </Heading>
        </Box>
        <Box>
          <Heading
            mb="0"
            mt="0"
            variant="subheadline"
            style={{ fontSize: "18px", textTransform: "uppercase" }}
          >
            Second Shot Date
          </Heading>
          <Heading
            mb="0"
            mt="0"
            variant="subtitle"
            style={{ fontSize: "22px" }}
          >
            {new Date(
              data?.record?.verified?.record?.secondShotDate
            )?.toLocaleDateString()}
          </Heading>
        </Box>
      </Grid>
      <span
        style={{
          color: {
            verifiedWithDiscrepancy: "#ffcc00",
            verified: "#4cd964",
            humanReviewRequired: "#ff9500",
            notVerified: "#ff3b30",
            noData: "#8e8e93",
          }[data?.status],
          display: "inline",
          verticalAlign: "middle",
          fontWeight: "600",
        }}
      >
        <p style={{ marginBottom: "0px" }}>
          <span style={{ verticalAlign: "middle" }}>
            <Icon
              glyph={
                {
                  verifiedWithDiscrepancy: "flag",
                  verified: "checkmark",
                  humanReviewRequired: "important",
                  notVerified: "forbidden",
                  noData: "checkbox",
                }[data?.status]
              }
            />
          </span>
          {
            {
              verifiedWithDiscrepancy: "Verified with Discrepancy",
              verified: "Verified",
              humanReviewRequired: "Human Review Required",
              notVerified: "Not Verified",
              noData: "No Data",
            }[data?.status]
          }
        </p>
      </span>
    </Card>
  );
}
