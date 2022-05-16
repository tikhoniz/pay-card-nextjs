// next
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
// material
import { Button, styled } from "@mui/material";
// components
import PaymentForm from "../src/components/PaymentForm";
// icon
import GoogleIcon from "../src/components/icons/icon-google";

const RootStyle = styled("div")(() => ({
	minHeight: "100vh",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
}));

export default function Home() {
	const { status } = useSession();

	const googleOAuthSignInHandler = () => {
		signIn("google");
	};

	return (
		<RootStyle>
			<Head>
				<title>Оплата</title>
				<meta name="description" content="модуль оплаты" />
			</Head>
			{status === "loading" && <h3>Загрузка...</h3>}

			{status === "unauthenticated" && (
				<Button
					type="button"
					variant="outlined"
					size="large"
					color="inherit"
					onClick={googleOAuthSignInHandler}
					startIcon={<GoogleIcon />}
				>
					Войти с аккаунтом Google
				</Button>
			)}

			{status === "authenticated" && <PaymentForm />}
		</RootStyle>
	);
}
