export default function AuthLayout({ children }) {
  // const { isLoggedIn } = useContext(AuthContext);
  // const router = useRouter();

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     router.push("/");
  //   }
  // }, [isLoggedIn]);

  return (
    <div className="flex items-center justify-center h-dvh"> 
      {children}
    </div>
  )
}