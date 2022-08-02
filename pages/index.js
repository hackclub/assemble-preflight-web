import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import qr from "jsqr";
import { Box, Container, Heading, Grid, Input, Button } from "theme-ui";
import { useRouter } from "next/router";
import VaccineCard from "../components/VaccineCard";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve(reader.result.substring(reader.result.indexOf(",") + 1));
    reader.onerror = (error) => reject(error);
  });

let statusMessageTranslator = {
  verified: "Your proof of vaccination has been verified!",
  verifiedWithDiscrepancy: `Your vaccine card is valid. However, there is a discrepancy that we'll need to manually review.`,
  humanReviewRequired: `We're reviewing your proof of vaccination.`,
  denied: `Your vaccination proof was denied, please upload new proof`,
  noData: `Please upload proof of vaccination.`,
};

let testStatusMessageTranslator = {
  verified: "Your proof of negative test has been verified!",
  verifiedWithDiscrepancy: `We're reviewing your proof of negative test.`,
  humanReviewRequired: `We're reviewing your proof of negative test.`,
  denied: `Your negative test proof was denied, please retest.`,
  noData: `Please upload proof of a negative test.`,
};

let statusButtonTranslator = {
  verified: (
    <>
      Re-upload proof <span className="arrow">&rarr;</span>
    </>
  ),
  verifiedWithDiscrepancy: (
    <>
      Re-upload proof <span className="arrow">&rarr;</span>
    </>
  ),
  verified: (
    <>
      Re-upload proof <span className="arrow">&rarr;</span>
    </>
  ),
  denied: (
    <>
      Re-upload proof <span className="arrow">&rarr;</span>
    </>
  ),
  noData: (
    <>
      Upload proof <span className="arrow">&rarr;</span>
    </>
  ),
};

async function qrCodeScan(file) {
  const promise = new Promise((resolveScanned) => {
    let resolved = false;

    const convertURIToImageData = (url) => {
      return new Promise((resolve, reject) => {
        if (!url) {
          return reject();
        }
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const image = document.createElement("img");
        image.onload = () => {
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(context.getImageData(0, 0, canvas.width, canvas.height));
        };
        image.crossOrigin = "Anonymous";
        image.src = url;
      });
    };
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        convertURIToImageData(reader.result).then((imageData) => {
          console.log(imageData);

          let output = qr(imageData.data, imageData.width, imageData.height);
          console.log(output);
          if (output) {
            if (output?.data?.startsWith("shc:/") && !resolved) {
              resolveScanned({
                valid: true,
                type: output?.version,
                data: output?.data,
              });
              resolved = true;
              return;
            }
            // qr code
          }
        });
      },
      false
    );

    reader.readAsDataURL(file);
    setTimeout(() => {
      if (!resolved) {
        resolveScanned({
          valid: false,
        });
        resolved = true;
      }
    }, 3000);
  });
  try {
    const output = await promise;
    return output;
  } catch (err) {
    return { valid: false };
  }
}

export default function Home() {
  const [status, setStatus] = useState("loading");
  const [userData, setUserData] = useState({});
  const [greeting, setGreeting] = useState("Hello");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    (async () => {
      let isAuthed = await fetch("/api/get-auth-state").then((res) =>
        res.text()
      );
      if (isAuthed == "TRUE") {
        setStatus("authed");
        const userDataResponse = await fetch("/api/small-records").then((res) =>
          res.json()
        );
        console.log({ userDataResponse });
        if (userDataResponse.reauth) {
          console.log(
            "Received reauth request from server. This typically means api.ticketing.assemble.hackclub.com has rejected the current token."
          );
          return setStatus("unauthed");
        }
        userDataResponse.vaccinationData = await fetch(
          "https://api.ticketing.assemble.hackclub.com/vaccinations",
          { credentials: "include" }
        ).then((res) => res.json());
        userDataResponse.testingData = await fetch(
          "https://api.ticketing.assemble.hackclub.com/tests",
          { credentials: "include" }
        ).then((res) => res.json());
        setUserData(userDataResponse);
      } else {
        setStatus("unauthed");
      }
    })();

    let myDate = new Date();
    let hrs = myDate.getHours();
    let greet;

    if (hrs < 12) greet = "Good morning";
    else if (hrs >= 12 && hrs <= 17) greet = "Good afternoon";
    else if (hrs >= 17 && hrs <= 24) greet = "Good evening";
    setGreeting(greet);
  }, []);
  return (
    <div>
      <Head>
        <title>Assemble Preflight</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="https://assemble.hackclub.com/invert.png" />
        <link rel="favicon" href="https://assemble.hackclub.com/invert.png" />
        <link
          rel="shortcut icon"
          href="https://assemble.hackclub.com/invert.png"
        />
      </Head>
      <canvas
        id="canvas"
        width="0"
        height="0"
        style={{ display: "none" }}
      ></canvas>
      {status == "authed" && (
        <Box
          py={3}
          sx={{
            minHeight: "100vh",
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,0.37718837535014005) 0%, rgba(2,0,36,0.36318277310924374) 35%, rgba(2,0,36,0.36878501400560226) 100%), url(https://cloud-2ppyw38ar-hack-club-bot.vercel.app/0golden-bay.png)",
            backgroundSize: "cover",
          }}
        >
          <Container py={3} variant="copy" bg="white" sx={{ borderRadius: 4 }}>
            <Heading as="h1" mb={3}>
              Assemble Preflight & Ticketing
            </Heading>
            <Box bg="red" p={3} mb={3} sx={{ borderRadius: 3, color: "white" }}>
              👋{" "}
              {userData?.name?.split(" ")?.[0]
                ? `${greeting}, ${userData?.name?.split(" ")?.[0]}`
                : greeting}
              ! Please use this portal to upload your proof of vaccination and
              your negative COVID-19 test (option will become available nearer
              to the event). After both have been verified, you will be provided
              a ticket with a barcode. Please screenshot this barcode or add it
              to Apple/Google Wallet and then present it at the front door
              during checkin.
            </Box>
            <Box
              bg="green"
              px={3}
              py={2}
              mb={3}
              sx={{
                display: "block",
                borderRadius: 3,
                width: "fit-content",
                color: "white",
                fontWeight: 800,
              }}
            >
              Required: Full Vaccination Against COVID-19
            </Box>
            <Heading mb={3}>
              {statusMessageTranslator[userData.vaccinationData?.status]}
            </Heading>
            <Box
              bg="sunken"
              className="card"
              p={3}
              mb={3}
              as="a"
              style={{
                display: "block",
                borderRadius: 3,
                fontWeight: 400,
                cursor:
                  // userData.vaccinationData?.status == "humanReviewRequired" ||
                  // userData.vaccinationData?.status ==
                  //   "verifiedWithDiscrepancy" ||
                  // userData.vaccinationData?.status == "verified" ||
                  // loading
                  // ? "default"
                  // : "pointer",
                  "pointer",
              }}
              href="javascript:void 0;"
              onClick={() => {
                if (
                  // userData.vaccinationData?.status == "humanReviewRequired" ||
                  // userData.vaccinationData?.status ==
                  //   "verifiedWithDiscrepancy" ||
                  // userData.vaccinationData?.status == "verified" ||
                  // loading
                  false
                ) {
                  return;
                } else {
                  document.getElementById("fileinput").click();
                }
              }}
            >
              <Heading variant="lead" my={0} style={{ lineHeight: "0px" }}>
                {loading
                  ? "Loading..."
                  : statusButtonTranslator[
                      userData.vaccinationData?.status
                    ] || (
                      <>
                        Upload Proof of Vaccination{" "}
                        <span className="arrow">&rarr;</span>
                      </>
                    )}
              </Heading>
            </Box>
            {userData?.vaccinationData?.record?.image?.data && (
              <img
                src={`data:${userData?.vaccinationData?.record?.image?.filetype};base64,${userData?.vaccinationData?.record?.image?.data}`}
                style={{
                  width: "100%",
                  borderRadius: "3px",
                  marginBottom: '8px'
                }}
                alt="FYI! HEICs previews are broken at the moment, fix coming soon! Don't worry though, we can still view the image."
              />
            )}
            {userData?.vaccinationData?.record?.verified && (
              <VaccineCard data={userData?.vaccinationData} mb="4" />
            )}
            <Box
              bg="orange"
              px={3}
              py={2}
              mb={3}
              sx={{
                display: "block",
                borderRadius: 3,
                width: "fit-content",
                color: "white",
                fontWeight: 800,
              }}
            >
              Required: Negative COVID Test
            </Box>
            <Box
              bg="sunken"
              className="card"
              p={3}
              mb={3}
              as="a"
              style={{
                display: "block",
                borderRadius: 3,
                fontWeight: 400,
                cursor: "pointer",
              }}
              href="javascript:void 0;"
              onClick={() => {
                if(confirm(
                  `👋 Hey! Thanks for taking the time to upload your COVID-19 test result. Please only upload a test 24 hours before your first outbound flight or if you are not flying to SF, 24 hours before the event. Any tests taken earlier will be invalid. Thank you for your understanding!`
                )){
                  document.getElementById("fileinput2").click();
                }
              }}
            >
              <Heading variant="lead" my={0} style={{ lineHeight: "0px" }}>
                {loading
                  ? "Loading..."
                  : testStatusMessageTranslator[
                      userData.testingData?.status
                    ] || (
                      <>
                        Upload Proof of Negative COVID-19 Test{" "}
                        <span className="arrow">&rarr;</span>
                      </>
                    )}
              </Heading>
            </Box>
            {userData?.testingData?.image?.data && (
              <img
                src={`data:${userData?.testingData?.image?.filetype};base64,${userData?.testingData?.image?.data}`}
                style={{
                  width: "100%",
                  borderRadius: "3px",
                }}
                alt="FYI! HEICs previews are broken at the moment, fix coming soon! Don't worry though, we can still view the image."
              />
            )}
            <input
              type="file"
              accept="image/*"
              id="fileinput"
              style={{ display: "none" }}
              onChange={async (e) => {
                try {
                  await fetch('/api/me');
                } catch (err) {
                  console.error(err);
                }
                const file = e.target.files[0];

                try {
                  const qrData = await qrCodeScan(file);
                  if (qrData.valid) {
                    console.log(qrData);
                    const resp = await fetch("/api/verified", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        qr: qrData.data,
                      }),
                      credentials: "include",
                    }).then((resp) => resp.json());
                    if (resp.error) return;
                    console.log(resp);
                    router.reload();
                  } else {
                    console.log("invalid", qrData);
                  }
                } catch (err) {}

                const base64 = await toBase64(file);
                const options = {
                  method: "POST",
                  body: JSON.stringify({
                    mimeType: file.type,
                    data: base64,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                };
                setLoading(true);
                fetch(
                  `https://api.ticketing.assemble.hackclub.com/vaccinations/image/base64`,
                  options
                )
                  .then((res) => res.json())
                  .then((json) => {
                    if (!json.error) {
                      router.reload();
                    } else {
                      setErrorMessage(json.reason);
                      setStatus("error");
                    }
                  })
                  .catch(() => {
                    setErrorMessage(
                      "Unexpected Error Occurred While Uploading Image"
                    );
                    setStatus("error");
                  });
              }}
            />
            <input
              type="file"
              accept="image/*"
              id="fileinput2"
              style={{ display: "none" }}
              onChange={async (e) => {
                const file = e.target.files[0];
                const base64 = await toBase64(file);
                const options = {
                  method: "POST",
                  body: JSON.stringify({
                    mimeType: file.type,
                    data: base64,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                };
                setLoading(true);
                fetch(
                  `https://api.ticketing.assemble.hackclub.com/tests/image/base64`,
                  options
                )
                  .then((res) => res.json())
                  .then((json) => {
                    if (!json.error) {
                      router.reload();
                    } else {
                      setErrorMessage(json.reason);
                      setStatus("error");
                    }
                  })
                  .catch(() => {
                    setErrorMessage(
                      "Unexpected Error Occurred While Uploading Image"
                    );
                    setStatus("error");
                  });
              }}
            />
          </Container>
        </Box>
      )}

      {status == "error" && (
        <main>
          <Heading as="h1" mb={3}>
            Assemble Preflight & Ticketing
          </Heading>

          <p>🛑 {errorMessage || `Unexpected Error Occurred`}</p>

          <div>
            <a
              href="javascript:void 0;"
              onClick={() => {
                window.location.replace("/signout");
              }}
            >
              <h2>
                Restart <span className="arrow">&rarr;</span>
              </h2>
              <p>Restart the vaccine verification process.</p>
            </a>
          </div>

          <p>Please report this error if it does not automatically resolve.</p>
        </main>
      )}

      {status == "uploaded" && (
        <main>
          <Heading as="h1" mb={3}>
            Assemble Preflight & Ticketing
          </Heading>

          <p>Uploaded, page not complete</p>
        </main>
      )}
      {status == "unauthed" && (
        <Box
          py={3}
          sx={{
            minHeight: "100vh",
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,0.37718837535014005) 0%, rgba(2,0,36,0.36318277310924374) 35%, rgba(2,0,36,0.36878501400560226) 100%), url(https://cloud-2ppyw38ar-hack-club-bot.vercel.app/0golden-bay.png)",
            backgroundSize: "cover",
          }}
        >
          <Container py={3} variant="copy" bg="white" sx={{ borderRadius: 4 }}>
            <Heading as="h1" mb={3}>
              Assemble Preflight & Ticketing
            </Heading>
            <Box bg="red" p={3} mb={3} sx={{ borderRadius: 3, color: "white" }}>
              👋 Hey there! We're super excited to be hosting you in San
              Francisco for Assemble 2022. Use this portal, or its associated
              iOS app, to upload your proof of vaccination and your negative
              COVID-19 test (opens nearer to the event). After both have been
              verified, you will be provided a ticket with a barcode. Please
              screenshot this barcode or add it to Apple/Google Wallet and then
              present it at the front door during checkin.
            </Box>
            <div>
              <Box
                bg="sunken"
                className="card"
                p={3}
                mb={3}
                as="a"
                href="/login"
                style={{ display: "block", borderRadius: 3 }}
              >
                <Heading mb={2}>
                  Web <span className="arrow">&rarr;</span>
                </Heading>
                <Box>
                  Sign in to start the preflight & vaccine verification process
                  in your browser.
                </Box>
              </Box>
              <Box
                bg="sunken"
                className="card"
                p={3}
                mb={3}
                as="a"
                // href={process.env.NEXT_PUBLIC_APPSTORE_URL}
                style={{
                  display: "block",
                  bg: "sunken",
                  borderRadius: 3,
                  opacity: 0.5,
                }}
              >
                <Heading mb={2}>
                  iOS App (coming soon) <span className="arrow">&rarr;</span>
                </Heading>
                <Box>
                  Download the iOS app for preflight, vaccine verification, and
                  real-time event integration.
                </Box>
              </Box>
            </div>
          </Container>
        </Box>
      )}

      {(status == "loading" ||
        (status == "authed" && Object.keys(userData).length == 0)) && (
        <Box
          py={3}
          sx={{
            minHeight: "100vh",
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,0.37718837535014005) 0%, rgba(2,0,36,0.36318277310924374) 35%, rgba(2,0,36,0.36878501400560226) 100%), url(https://cloud-2ppyw38ar-hack-club-bot.vercel.app/0golden-bay.png)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundSize: "cover",
          }}
        >
          <Heading sx={{ color: "white" }}>Loading, please wait...</Heading>
        </Box>
      )}
    </div>
  );
}
