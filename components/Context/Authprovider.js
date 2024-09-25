import React, { createContext, useState, useEffect, useContext, useRef, } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase'
import country from '../../common/country';
import { err } from 'react-native-svg';

export const AuthContext = createContext({});
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})


export default AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [firstLoad, setFirstLoad] = useState(false)
    const [session, setSession] = useState(null)
    const [uid, setuid] = useState(null)
    const [user, setUser] = useState(null)
    const [loggedIn, setLoggedIN] = useState(false)
    const [darkMode, setDarkMode] = useState()
    const [image, setImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false)
    const [savedContact, setSavedContact] = useState()
    const [country, setCountry] = useState()
    const [userStory, setUserStory] = useState()
    const [storyContent, setStoryContent] = useState()
    const [contactStory, setContactStory] = useState()
    const [Viewerinfo, setViewerinfo] = useState()

    useEffect(() => {
        AppLoaded()
        LoggedIN()
    }, [])

    useEffect(() => {
        if (uid) {
            subscribeToUserChanges(uid)
        }
        GetStoryInfo()
        GetStoryViewedUserData()
    }, [uid])

    useEffect(() => {
        GetUserOnce()
    }, [loggedIn])

    useEffect(() => {
        FetchAllUpdates()
        SubScribeToStatus()
    }, [savedContact])

    useEffect(() => {
        if (user) {
            setDarkMode(user?.dark_mode)
            if (user.profile_pic) downloadImage(user.profile_pic)
            FetchSaVedContactData()
        }
    }, [user])

    const AddCountry = async (country) => {
        try {
            const { data, error } = await supabase
                .from('country')
                .upsert(country)
        }
        catch (error) {
            console.log(error)
        }
    }

    const FetchCountry = async () => {
        try {
            const { data, error } = await supabase
                .from('country')
                .select('*')
            if (!error) setCountry(data)
        }
        catch (error) {
            console.log(error)

        }
    }


    const AddUser = async (userId, profileData, navigation) => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('profiles')
                .upsert({ id: userId, ...profileData }, { onConflict: ['id'] });

            if (error) {
                throw error;
            }
            if (!error) navigation.navigate("Profile")
            await AsyncStorage.setItem("loggedIN", "TRUE")
            setLoading(false)
        } catch (error) {
            console.error('Error adding to profile:', error.message);
            setLoading(false)
            return null;
        }
        finally {
            setLoading(false)

        }
    };

    const FetchSaVedContactData = async () => {
        try {
            let { data: Savedcontact, error } = await supabase
                .from('Savedcontact')
                .select(`user_id,saved_name,profiles(*)`)
                .eq('user_id', uid);
            setSavedContact(Savedcontact)

        }
        catch (error) {
            console.log(error)
        }
    };


    const subscribeToUserChanges = (userId) => {
        const subscription = supabase
            .channel('public:profiles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, (payload) => {
                setUser(payload.new);
            })
            .subscribe();
        return () => {
            supabase.removeChannel(subscription);
        };
    };

    const UpdateUser = async (userId, updates) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId);

            if (error) {
                throw error;
            }
            setUser({ ...user, ...updates })
            return data;
        } catch (error) {
            console.error('Error updating user:', error.message);
            return null;
        }
    };

    const UploadStory = async (imageUrl, content) => {
        try {
            const arraybuffer = await fetch(imageUrl).then((res) => res.arrayBuffer())
            const filename = `${uid}.jpg`;
            await supabase
                .storage
                .from('story')
                .remove([filename]);

            const { data, error } = await supabase
                .storage
                .from('story')
                .upload(filename, arraybuffer, {
                    contentType: 'image/jpeg',
                    upsert: true
                });
            if (error) {
                console.log(error);
                return
            }
            const storyObj = {}
            storyObj.created_at = Date.now()
            storyObj.story = filename
            storyObj.uploader = uid
            storyObj.content = content
            await InsertStory(storyObj)
            DownloadStory(filename)
            GetStoryInfo()
        } catch (error) {
            setImageLoading(false)
            console.log('Error uploading image:', error.message);
        }
    }

    const InsertStory = async (story) => {
        try {
            const { data: obj, error } = await supabase
                .from('story')
                .insert([story]);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error inserting data:', error.message);
        }
    }

    const GetStoryInfo = async () => {
        try {
            const { data, error } = await supabase
                .from('story')
                .select('*')
                .eq("uploader", uid)
            if (!error) {
                setStoryContent(data[0])
                DownloadStory(data[0].story)
            }
        }
        catch (error) {
            console.log(error)

        }
    }

    const DownloadStory = async (filename) => {
        try {
            const { data, error } = await supabase.storage
                .from('story')
                .download(filename);

            if (error) {
                console.error('Error downloading image:', error.message);
                return;
            }
            const fr = new FileReader();
            fr.readAsDataURL(data);
            fr.onload = () => {
                setUserStory(fr.result)
            };
        } catch (error) {
            console.error('Error:', error.message);
        }
        finally {

        }
    };


    const uploadImage = async (imageUri) => {
        setImageLoading(true)
        try {
            const arraybuffer = await fetch(imageUri).then((res) => res.arrayBuffer())
            const filename = `${uid}.jpg`;
            await supabase
                .storage
                .from('avatars')
                .remove([filename]);

            const { data, error } = await supabase
                .storage
                .from('avatars')
                .upload(filename, arraybuffer, {
                    contentType: 'image/jpeg',
                    upsert: true
                });
            if (error) {
                console.log(error);
                setImageLoading(false)
                return
            }
            await UpdateUser(uid, { profile_pic: filename })
            downloadImage(filename)
        } catch (error) {
            setImageLoading(false)
            console.log('Error uploading image:', error.message);
        }
    };

    const downloadImage = async (filename) => {
        // setImageLoading(true)
        try {
            const { data, error } = await supabase.storage
                .from('avatars')
                .download(filename);

            if (error) {
                console.error('Error downloading image:', error.message);
                return;
            }
            const fr = new FileReader();
            fr.readAsDataURL(data);
            fr.onload = () => {
                setImage(fr.result)
                setImageLoading(false)
            };
        } catch (error) {
            console.error('Error:', error.message);
            setImageLoading(false)
        }
        finally {
            setImageLoading(false)

        }
    };

    const GetUserOnce = async () => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setuid(session?.user?.id)
        })
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setuid(session?.user?.id)
        })
        if (!session?.user?.id) {
            // console.log('User ID is null, cannot fetch user');
            return;
        }
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session?.user?.id)
                .single();

            if (error) {
                throw error;
            }
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error.message);
            return null;
        }
    }


    const VerifyOTP = async (phone, otp) => {
        setLoading(true);
        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.verifyOtp({
                phone: phone,
                token: otp,
                type: 'sms',
            });

            if (error) {
                throw error;
            }
            if (session?.user.id) {
                setSession(session);
                setuid(session?.user.id);
                return session.user.id
            }

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };



    const AppLoaded = async () => {
        const value = await AsyncStorage.getItem("loaded")
        if (value !== null) setFirstLoad(true)
        else setFirstLoad(false)
    }
    const LoggedIN = async () => {
        const value = await AsyncStorage.getItem("loggedIN")
        if (value !== null) setLoggedIN(true)
        else setLoggedIN(false)
    }



    const FetchAllUpdates = async () => {
        if (savedContact && savedContact.length > 0) {
            let StoryData = []
            for (let contactData in savedContact) {
                const UpdatedData = await FetchContactStory(savedContact[contactData].profiles.id)
                if (UpdatedData[0] !== undefined) {
                    StoryData.push(UpdatedData[0])
                    StoryData[contactData].saved_name = savedContact[contactData].saved_name
                }
            }
            if (StoryData && StoryData.length > 0) {
                for (let storyImage in StoryData) {
                    const ImageData = await DownloadContactStoryImage(StoryData[storyImage].story)
                    StoryData[storyImage].image = ImageData
                }
                for (let profileImage in StoryData) {
                    const profile_pic = `${StoryData[profileImage].uploader}.jpg`
                    const UserImage = await FetchContactProfileImage(profile_pic)
                    StoryData[profileImage].user_image = UserImage
                }
            }
            setContactStory(StoryData)
        }

    }

    const FetchContactStory = async (contactId) => {
        try {
            const { data, error } = await supabase
                .from('story')
                .select("*")
                .eq("uploader", contactId)
            if (error) {
                console.log(error)
                return
            }
            return data
        }
        catch (error) {
            console.log(error)
            return
        }
    }

    const DownloadContactStoryImage = async (fileName) => {
        try {
            const { data, error } = await supabase.storage
                .from('story')
                .download(fileName);

            if (error) {
                console.error('Error downloading image:', error.message);
                return;
            }
            return new Promise((resolve, reject) => {
                const fr = new FileReader();
                fr.readAsDataURL(data);
                fr.onload = () => {
                    resolve(fr.result);
                };
                fr.onerror = (err) => {
                    reject(err);
                };
            });
        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    const FetchContactProfileImage = async (filename) => {
        // if (!filename) return null;
        try {
            const { data, error } = await supabase.storage
                .from('avatars')
                .download(filename);

            if (error) {
                console.error('Error downloading image:', error.message);
                return null;
            }
            return new Promise((resolve, reject) => {
                const fr = new FileReader();
                fr.readAsDataURL(data);
                fr.onload = () => {
                    resolve(fr.result);
                };
                fr.onerror = (err) => {
                    reject(err);
                };
            });
        } catch (error) {
            console.error('Error:', error.message);
            return null;
        }
    };


    const SubScribeToStatus = async () => {
        const subscription = supabase
            .channel('public:story')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'story' }, (payload) => {
                const newData = payload.new;
                if (newData) {
                    const newStatus = GetnewStatus(newData.uploader)
                    if (newStatus) FetchAllUpdates()
                }
            })
            .subscribe();
    }


    const GetnewStatus = (data) => {
        for (let newData in savedContact) {
            if (savedContact[newData].profiles.id === data) return true
        }
        return false
    }

    const StatusViewed = async (vieweddata) => {
        if (vieweddata) {
            const check = await CheckStatusView(vieweddata.status_id, vieweddata.viewer)
            if (check) return
            else {
                try {
                    const { data, error } = await supabase
                        .from('statusView')
                        .insert([vieweddata]);
                    if (error) {
                        console.log(error)
                    }
                }
                catch (error) {
                    console.log(error)
                }
            }
        }
    }

    const CheckStatusView = async (status_id, viewer) => {
        try {
            const { data, error } = await supabase
                .from('statusView')
                .select("*")
                .match(
                    {
                        status_id,
                        viewer
                    }
                )
            if (error) {
                console.log(error)
                return
            }
            if (data.length > 0) return true
            else return false
        }
        catch (error) {

        }
    }


    const GetStoryViewedUserData = async () => {
        let Vieweduser
        try {
            const { data: UserData, error } = await supabase
                .from('statusView')
                .select("*")
                .eq("status_owner", uid)
            if (error) {
                console.log("1", error)
            }
            if (UserData) Vieweduser = UserData
        }
        catch (error) {
            console.log("2", error)
        }
        if (Vieweduser && Vieweduser.length > 0) {
            const ViewerArray = []
            let viewObj = {}
            for (let data in Vieweduser) {
                const resultdata = await GetContactData(Vieweduser[data].viewer)
                viewObj.saved_name = resultdata[0].saved_name
                viewObj.viewer_id = resultdata[0].profiles.id
                viewObj.profile_pic = resultdata[0].profiles.profile_pic
                viewObj.time = Vieweduser[data].viewed
                viewObj.status_owner = Vieweduser[data].status_owner
                viewObj.status_id = Vieweduser[data].status_id
                ViewerArray.push(viewObj)
            }
            if (ViewerArray && ViewerArray.length > 0) {
                for (let data in ViewerArray) {
                    const result = await FetchContactProfileImage(ViewerArray[data].profile_pic)
                    ViewerArray[data].profile_pic = result
                }
                setViewerinfo(ViewerArray)
            }
        }
    }

    const GetContactData = async (viewer) => {
        try {
            const { data, error } = await supabase
                .from('Savedcontact')
                .select(`user_id,saved_name,profiles(*)`)
                .match({
                    user_id: uid,
                    saved_id: viewer
                })
            if (error) {
                console.log(error)
            }
            if (data) return data
        }
        catch (error) {
            console.log("2", error)
        }
    }


    const value = { Viewerinfo, StatusViewed, contactStory, GetStoryInfo, storyContent, userStory, UploadStory, FetchSaVedContactData, setSavedContact, country, FetchCountry, savedContact, image, imageLoading, setImage, downloadImage, uploadImage, loggedIn, session, loading, VerifyOTP, firstLoad, AddUser, GetUserOnce, user, uid, UpdateUser, AppLoaded, darkMode }
    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider >
    )

}

