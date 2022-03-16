// import React, {
//   createContext,
//   FC,
//   useState,
//   useContext,
//   useEffect,
// } from 'react';
// import { Magic } from 'magic-sdk';

// interface DashboardConfig {
//   user?: {};
//   loading: boolean;
//   isConfigured: boolean;
// }

// export const DashboardContext = createContext<DashboardConfig>(null!);

// export const DashboardProvider: FC<{
//   magicLinkKey?: string;
// }> = ({ children, magicLinkKey }) => {
//   const initMagicLinkKey =
//     magicLinkKey || process.env.NEXT_PUBLIC_MAGICLINK_KEY;
//   const isConfigured = Boolean(initMagicLinkKey);

//   const [data, setData] = useState<{ loading: boolean; user?: any }>({
//     loading: false,
//   });

//   useEffect(() => {
//     if (isConfigured) {
//       setData({ loading: true });
//       const magic = new Magic(initMagicLinkKey || '');
//       magic.user.isLoggedIn().then(isLoggedIn => {
//         if (isLoggedIn) {
//           magic.user.getMetadata().then(userData => {
//             setData({ loading: false, user: userData });
//           });
//         } else {
//           setData({ loading: false, user: null });
//         }
//       });
//     }
//   }, []);

//   return (
//     <DashboardContext.Provider value={{ ...data, isConfigured }}>
//       {children}
//     </DashboardContext.Provider>
//   );
// };

// export const useDashboard = () => {
//   return useContext(DashboardContext);
// };
