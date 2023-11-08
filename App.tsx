import React, {useState} from 'react';
import {View, Button, Text} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

const App = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  //   const convertContentURIToFilePath = async contentURI => {
  //     try {
  //       const filePath = await RNFS.getFilePathFromURI(contentURI);
  //       return filePath;
  //     } catch (error) {
  //       console.error('Error converting contentURI to filePath:', error);
  //       return null;
  //     }
  //   };

  const openFilePicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      setSelectedMedia(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Handle cancellation
      } else {
        // Handle other errors
        console.error(err);
      }
    }
  };

  //   const shareMedia = async () => {
  //     if (selectedMedia) {
  //       console.log(selectedMedia);

  //       const shareOptions = {
  //         title: 'Share Media',
  //         subject: 'Share Media Subject',
  //         message: 'Check out this media!',
  //         url: selectedMedia[0].uri,
  //       };

  //       Share.open(shareOptions)
  //         .then(res => {
  //           console.log('res', res);
  //         })
  //         .catch(err => {
  //           console.error(err);
  //         });
  //     }
  //   };

  const shareMedia = async () => {
    if (selectedMedia) {
      try {
        const fileUri = selectedMedia[0].uri;
        console.log(selectedMedia);

        const parts = selectedMedia[0].type.split('/');
        const fileType = parts[parts.length - 1];
        console.log(fileType);

        // Create a temporary directory to store the shared file
        const tempDir = RNFS.CachesDirectoryPath;

        // Generate a unique file name
        const fileName = `${Date.now()}.${fileType}`; // You may need to adjust the file extension

        // Create the target path for the local file
        const targetPath = `${tempDir}/${fileName}`;

        // Copy the content URI to the local file
        await RNFS.copyFile(fileUri, targetPath);

        const shareOptions = {
          title: 'Share Media',
          subject: 'Share Media Subject',
          message: 'Check out this media!',
          url: `file://${targetPath}`,
        };

        Share.open(shareOptions)
          .then(res => {
            console.log('res', res);
          })
          .catch(err => {
            console.error(err);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View>
      <Button title="Select Media" onPress={openFilePicker} />
      {selectedMedia && <Text>Selected Media: {selectedMedia[0].name}</Text>}
      {selectedMedia && <Button title="Share Media" onPress={shareMedia} />}
    </View>
  );
};

export default App;
