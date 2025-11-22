import ClientLayout from "./ClientLayout";


export const metadata = {
  title: "User Dashboard",
  description: "User management dashboard (starter)",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode;}>) {

  return <ClientLayout>{children}</ClientLayout>;
}
