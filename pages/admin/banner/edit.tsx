import Layout from "@/components/admin/Layout/Layout";
import withAuth from "@/components/admin/withAuth";
import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { TextField as TextFieldInput } from "formik-material-ui";
import { Field, Form, Formik, FormikProps } from "formik";
import { Button, Card, CardContent, CardActions } from "@mui/material";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Editor } from "@tinymce/tinymce-react";
import { productImageURL, getBase64 } from "@/utils/commonUtil";
import axios from "axios";
import Swal from "sweetalert2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { appDispatch, appSelector } from "@/store/hooks";
import { getBanner, editBanner, getBannerById } from "@/features/admin/banner";
import router, { useRouter } from "next/router";
import Image from "next/image";

function Edit() {
  const dispatch = appDispatch();
  const id: any = router.query.id;
  const editorRef = useRef<any>(null);
  const [status, setStatus] = React.useState<String>("Active");
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const { data } = appSelector((state) => state.banner);
  const [topic, setTopic] = React.useState<String>("");
  if (data) {
    if (data.length === 0) {
      router.push("/admin/banner");
    }
  }

  const showPreviewImage = (values: any) => {
    if (values.file_obj) {
      return (
        <Image
          objectFit="contain"
          alt="product image"
          src={values.file_obj}
          width={200}
          height={100}
        />
      );
    } else if (data) {
      if (data.length > 0) {
        return (
          <Image
            objectFit="contain"
            alt="product image"
            src={`/upload/banner/${data[0].filename}`}
            width={200}
            height={100}
          />
        );
      }
    }
  };

  React.useEffect(() => {
    dispatch(getBannerById(id)).then((value: any) => {
      if (value.payload) {
        if (value.payload.length > 0) {
          setDate(dayjs(value.payload[0].post_date));
          setTopic(value.payload[0].topic);
          setStatus(value.payload[0].status);
        }
      }
    });
  }, [dispatch, id]);

  const initialValues: any = {
    post_date: date,
    topic: topic,
    status: status,
  };

  const showForm = ({ values, setFieldValue, isValid }: FormikProps<any>) => {
    return (
      <Form>
        <Card>
          <CardContent sx={{ padding: 4 }}>
            <Typography gutterBottom variant="h4">
              Edit Banner
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label="Post Date"
                format="YYYY-MM-DD"
                value={dayjs(`${date}`)}
                onChange={(newValue: any) => {
                  console.log(newValue);
                  setDate(newValue);
                }}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
            <br />
            <br />
            <Field
              fullWidth
              component={TextFieldInput}
              name="topic"
              type="text"
              label="Topic"
              value={topic}
              onChange={(e: any) => {
                setTopic(e.target.value);
              }}
            />
            <br />
            <br />
            <Field
              name="status"
              style={{ marginTop: 16 }}
              component={() => (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Status"
                    onChange={(e: any) => {
                      setStatus(e.target.value);
                    }}
                    value={status}
                    fullWidth
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">In Active</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <br />
            <br />
            <Box>
              <span style={{ color: "#00B0CD", marginLeft: 10 }}>
                Add Picture
              </span>
              <input
                type="file"
                onChange={(e: React.ChangeEvent<any>) => {
                  e.preventDefault();
                  if (e.target.files[0]) {
                    setFieldValue("file", e.target.files[0]);
                    setFieldValue(
                      "file_obj",
                      URL.createObjectURL(e.target.files[0])
                    );
                  }
                }}
                name="banner"
                accept="image/*"
                id="banner"
                style={{ padding: "20px 0 0 20px" }}
              />
              <div style={{ margin: 16, width: 200, height: 100 }}>
                {showPreviewImage(values)}
              </div>
            </Box>
          </CardContent>
          <CardActions>
            <Button
              disabled={!isValid}
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginRight: 1 }}
            >
              Save
            </Button>

            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={() => router.push("/admin/banner")}
            >
              Cancel
            </Button>
          </CardActions>
        </Card>
      </Form>
    );
  };

  return (
    <Layout>
      <Box>
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <Formik
            validate={(values) => {
              let errors: any = {};
              if (!values.post_date) errors.post_date = "Enter Post Date";
              if (!topic) errors.topic = "Enter Topic";
              if (!values.status) errors.status = "Enter Status";
              return errors;
            }}
            initialValues={initialValues}
            onSubmit={async (values, { setSubmitting }) => {
              const value_date = dayjs(date, "YYYY-MM-DD").toDate();
              let day: any = value_date.getDate();
              let month: any = value_date.getMonth() + 1;
              if (month <= 9) {
                month = "0" + month;
              }
              if (day <= 9) {
                day = "0" + day;
              }
              const year = value_date.getFullYear();
              const post_date = year + "-" + month + "-" + day;
              if (values.file) {
                var filename = values.file.name;
                var reader = new FileReader();
                reader.onload = function (event: any) {
                  var imagevalue = event.target.result;
                  fetch(imagevalue)
                    .then((res) => res.blob())
                    .then(async (blob) => {
                      var formData = new FormData();
                      formData.append("post_date", post_date);
                      formData.append("topic", String(topic));
                      formData.append("status", String(status));
                      formData.append("file", blob, filename);
                      formData.append("banner_id", id);
                      var urlupload = process.env.NEXT_PUBLIC_BASE_URL_API;
                      const response: any = await axios.post(
                        `${urlupload}/banner/edit/withimage`,
                        formData
                      );
                      if (response.data.status == "success") {
                        Swal.fire(
                          "Success!",
                          "Your data has been updated.",
                          "success"
                        ).then(function () {
                          router.push("/admin/banner");
                        });
                      } else {
                        Swal.fire(
                          "Error!",
                          "Please check your data.",
                          "error"
                        ).then(function () {
                          return false;
                        });
                      }
                    });
                };
                reader.readAsDataURL(values.file);
              } else {
                var formData = new FormData();
                formData.append("post_date", post_date);
                formData.append("topic", String(topic));
                formData.append("status", String(status));
                formData.append("banner_id", id);
                var urlupload = process.env.NEXT_PUBLIC_BASE_URL_API;
                const response: any = await axios.post(
                  `${urlupload}/banner/edit`,
                  formData
                );
                if (response.data.status == "success") {
                  Swal.fire(
                    "Success!",
                    "Your data has been updated.",
                    "success"
                  ).then(function () {
                    router.push("/admin/banner");
                  });
                } else {
                  Swal.fire("Error!", "Please check your data.", "error").then(
                    function () {
                      return false;
                    }
                  );
                }
              }

              setSubmitting(false);
            }}
          >
            {(props) => showForm(props)}
          </Formik>
        </Box>
      </Box>
    </Layout>
  );
}

export default withAuth(Edit);
