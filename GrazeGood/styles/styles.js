import { StyleSheet } from "react-native";

import Colours from "./colours";


export default StyleSheet.create({
    Page: {
        backgroundColor: Colours.background,
        justifyContent: "flex-start",
        paddingBottom: 40
    },
    StaticPage: {
        backgroundColor: Colours.background,
        justifyContent: "flex-start",
        paddingBottom: 40,
        flex: 1
    },
    Title: {
        color: Colours.text,
        fontSize: 30,
        fontWeight: "bold",
        padding: 20,
        textAlign: "center"
    },
    SubTitle: {
        color: Colours.text, 
        fontFamily: "Montserrat_700Bold",
        fontSize: 20, 
        fontWeight: "bold",
        marginTop: 10,
        marginLeft: 20,
        alignContent: "center"
    },
    HomeTextContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    SubTitleRight: {
        display: "flex",
        flexDirection: "row",
        alignContent: "flex-end",
        marginRight: 5
    },
    SeeMoreBtn: {
        color: Colours.text,
        fontWeight: "bold",
        marginRight: 20,
        alignContent: "center",
    },
    SeeMoreText: {
        color: Colours.text,
        fontWeight: "bold",
        marginRight: 10,
        alignContent: "center",
        fontSize: 18
    },
    SeeMoreContainer: {
        marginTop: "auto",
        display: "flex",
        flexDirection: "row",
    },
    FlatListContainer: {
        padding: 0,
        width: "100%",
        height: 300,
    },
    ProductContainer: {
        padding: 10,
        backgroundColor: Colours.cards,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 20,
        width: 150,
        height: 250,
        
        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    ProductInfo: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 15,
    },
    ProductName: {
        color: Colours.text,
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",

        width: 100,

        minHeight: 80,
        maxHeight: 80,
    },
    ProductImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    EcoScoreContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        backgroundColor: Colours.accent,
        borderRadius: 100,
        gap: 5,
        padding: 5,

        marginTop: "auto",
        marginBottom: 5,
    },
    EcoScore: {
        color: Colours.text, 
        fontSize: 12, 
    },
    NoProducts: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20, 
    },
    loadingContainer: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: Colours.text,
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center",
    },
    falseText: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colours.text,
        textAlign: "center",
        justifyContent: "center",
    },
    prePermissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    prePermissionText: {
        color: "#215C3D",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#A0AF84',
        width: "100%",
        marginVertical: 10,
    },
    text: {
        color: Colours.text,
        fontSize: 20,
        margin: 5,
        textAlign: 'left',
    },
    infoText: {
        color: '#a0af84',
        fontSize: 16,
        textAlign: 'left',
        margin: 0
    },
    headingText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: Colours.text
    },
})