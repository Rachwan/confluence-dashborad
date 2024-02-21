import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { usePathname } from "next/navigation";
// import { useAuthContext } from 'src/contexts/auth-context';
import { useContext } from "react";
import { UserContext } from "src/contexts/UserContext";
import { redirect } from "next/navigation";

export const AuthGuard = (props) => {
  const pathname = usePathname();
  const { user, checkUser } = useContext(UserContext);

  const { children } = props;

  const router = useRouter();
  // const { isAuthenticated } = useAuthContext();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  const infPathes = ["/", "/influencer-details", "/myCollaborations", "/addCollaboration"];
  const infAdminPathes = [
    "/",
    "/settings",
    "/notifications",
    "/influencer-details",
    "/myCollaborations",
    "/addCollaboration",
  ];

  const adminPathes = [
    "/",
    "/influencers",
    "/businesses",
    "/admins",
    "/platforms",
    "/categories",
    "/cities",
    "/soon",
    "/subscribers",
    "/allCollaborations",
    "/myCollaborations",
    "/addCollaboration",
    "/influencer-details",
    "/notifications",
    "/settings",
  ];
  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.

  // useEffect(() => {
  //   if (!router.isReady) {
  //     return;
  //   }

  //   // Prevent from calling twice in development mode with React.StrictMode enabled
  //   if (ignore.current) {
  //     return;
  //   }

  //   ignore.current = true;

  //   if (false) {
  //     console.log("Not authenticated, redirecting");
  //     router
  //       .replace({
  //         pathname: "/auth/login",
  //         query: router.asPath !== "/" ? { continueUrl: router.asPath } : undefined,
  //       })
  //       .catch(console.error);
  //   } else {
  //     setChecked(true);
  //   }
  // }, [router.isReady]);

  // if (!checked) {
  //   return null;
  // }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  if (checkUser) {
    return <div>Loadinggggggg..........</div>;
  }
  if (user && ["influencer", "admin"].includes(user.role)) {
    if (infAdminPathes.includes(pathname) && ["influencer", "admin"].includes(user.role)) {
      console.log("influencer , and admin access");
      return children;
    }
    if (infPathes.includes(pathname) && user.role === "influencer") {
      console.log("influencer access");
      return children;
    }

    if (!infPathes.includes(pathname) && user.role === "influencer") {
      console.log("influencer access");
      return <div>Unauthorized</div>;
    }

    if (adminPathes.includes(pathname) && user.role === "admin") {
      console.log("amdin access");
      return children;
    }
  } else if (user && ["business"].includes(user.role)) {
    console.log("business access");
    return <div>unauthorized --- business</div>;
  } else {
    console.log("no useeeeeeerrrrrrrr babe");
    return <div>Unauthorized --- no user</div>;
  }
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
