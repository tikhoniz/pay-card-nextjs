import * as yup from "yup";
import { useState } from "react";
//next
import { signOut, useSession } from "next-auth/react";
// form
import { useFormik } from "formik";
// material
import {
	Button,
	Paper,
	Stack,
	styled,
	TextField,
	Typography,
} from "@mui/material";

//-----------------------------------------------
const RootStyle = styled("div")(() => ({
	width: 480,
}));
//-----------------------------------------------

const ButtonStyled = styled(Button)(() => ({
	borderColor: "#0e447a",
	color: "#fff",
	backgroundImage: "linear-gradient(45deg, #0e447a 50%, transparent 50%)",
	backgroundPosition: "100%",
	backgroundSize: "400%",
	transition: "background 500ms ease",
	"&:hover": {
		backgroundPosition: 0,
	},
}));

const TextFieldStyled = styled(TextField)(() => ({
	"& fieldset": {
		borderColor: "#d1d1d1",
		boxShadow: "inset 1px 1px 3px -1px rgba(0, 0, 0, 0.6)",
	},
	"& .MuiInputLabel-root": { color: "#fff" },
	"& .MuiOutlinedInput-root": {
		color: "#fff",
		"&:hover fieldset": { borderColor: "#fff" },
	},
}));

const PaymentForm = () => {
	const { data: session } = useSession();
	const [payment, setPayment] = useState(false);

	const userEmail = session?.user?.email;

	const PaymentSchema = yup.object().shape({
		cardNumber: yup
			.string()
			.max(16, "Длина не должна превышать 16 цифр")
			.matches(/([0-9])/, "Только цифры")
			.required("Обязательное поле"),
		expirationDate: yup
			.string()
			.max(7, "Укажите дату в формате: MM/YYYY")
			.matches(/([0-9]{2})\/([0-9]{4})/, "Укажите дату в формате: MM/YYYY")
			.required("Обязательное поле"),
		cvv: yup
			.string()
			.min(2, "Длина 3 цифры")
			.max(3, "Длина 3 цифры")
			.matches(/([0-9]{3})/, "Только цифры")
			.required("Обязательное поле"),

		amount: yup
			.number()
			.typeError("Только цифры")
			.required("Обязательное поле")
			.positive()
			.integer(),
	});

	const formik = useFormik({
		initialValues: {
			cvv: "",
			amount: "",
			cardNumber: "",
			expirationDate: "",
		},
		validationSchema: PaymentSchema,
		onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
			const response = await fetch(`/api/payment`, {
				method: "POST",
				body: JSON.stringify({ ...values, payer: userEmail }),
				headers: { "Content-Type": "application/json" },
			})
				.then(async (response) => {
					if (response.ok) {
						return response.json();
					}
					//если ответ не response.ok
					const data = await response.json();
					throw new Error(
						data.message || "Something went wrong! [API function createWorkout]"
					);
				})
				.catch((error) => {
					return error;
				});

			if (!response.RequestId) {
				setErrors(response.message);
			}

			setPayment(response);
			resetForm();
			setSubmitting(false);
		},
	});

	const {
		errors,
		touched,
		isValid,
		dirty,
		isSubmitting,
		handleSubmit,
		getFieldProps,
	} = formik;

	return (
		<RootStyle>
			<Stack direction="row" justifyContent="space-between" sx={{ mb: 5 }}>
				<Typography variant="h1" sx={{ fontSize: 28 }}>
					Оплата кредитной картой
				</Typography>
				<Button onClick={() => signOut()}>Выйти</Button>
			</Stack>
			<Paper
				sx={{
					p: 5,
					mb: 2.5,
					background:
						"linear-gradient(45deg, rgb(154, 174, 212) 33%, rgb(182, 166, 82) 81%)",
				}}
			>
				{payment && (
					<Stack alignItems="center" sx={{ mb: 5 }}>
						<Typography variant="h6" sx={{ color: "green" }}>
							Успешная оплата
						</Typography>
						<Typography variant="subtitle1">
							Ваш заказ ID: {payment.RequestId}
						</Typography>
						<Typography variant="subtitle1">Сумма: {payment.Amount}</Typography>
					</Stack>
				)}
				<form onSubmit={handleSubmit}>
					<Stack spacing={4}>
						<TextFieldStyled
							fullWidth
							size="small"
							label="Card Number"
							{...getFieldProps("cardNumber")}
							error={Boolean(touched.cardNumber && errors.cardNumber)}
							helperText={touched.cardNumber && errors.cardNumber}
						/>

						<TextFieldStyled
							fullWidth
							size="small"
							label="Expiration Date MM/YYYY"
							{...getFieldProps("expirationDate")}
							error={Boolean(touched.expirationDate && errors.expirationDate)}
							helperText={touched.expirationDate && errors.expirationDate}
						/>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<TextFieldStyled
								size="small"
								label="CVV"
								{...getFieldProps("cvv")}
								error={Boolean(touched.cvv && errors.cvv)}
								helperText={touched.cvv && errors.cvv}
							/>
							<TextFieldStyled
								size="small"
								label="Amount"
								{...getFieldProps("amount")}
								error={Boolean(touched.amount && errors.amount)}
								helperText={touched.amount && errors.amount}
							/>
						</Stack>

						<ButtonStyled
							id="create"
							type="submit"
							fullWidth
							variant="contained"
							disabled={!dirty || !isValid}
						>
							Оплатить
						</ButtonStyled>
					</Stack>
				</form>
			</Paper>
		</RootStyle>
	);
};

export default PaymentForm;
