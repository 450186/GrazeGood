import { StyleSheet } from "react-native";

import Colours from "./colours";


export default StyleSheet.create({
    logoContainer: {
      display: "flex",
      flexDirection: "row", 
      alignItems: "center",
      justifyContent: "center"
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        left: -25
    },
    Grazegood: {
        color: Colours.text,
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 5,
        left: -20
    },
    Page: {
        backgroundColor: Colours.background,
        justifyContent: "flex-start",
        paddingBottom: 40
    },
    savedPage: {
        flex: 1,
        backgroundColor: Colours.background
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
    Brand: {
        color: Colours.text,
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,        
    },
    SubTitle: {
        color: Colours.text, 
        fontFamily: "Montserrat_700Bold",
        fontSize: 20, 
        fontWeight: "bold",
        marginLeft: 10,
        alignContent: "center"
    },
    HomeTextContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    SubTitleRight: {
        display: "flex",
        flexDirection: "row",
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
        fontFamily: "Montserrat_700Bold",
        fontWeight: "bold",
        marginRight: 5,
        alignContent: "center",
        marginBottom: 2,
        fontSize: 14
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
    SubContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50
    },
    Button: {
        backgroundColor: Colours.button,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 20
    },
    ButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    ScannedInfo: {
        backgroundColor: Colours.cards,
        width: "100%",
        marginHorizontal: "auto",
        padding: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    ProductHead: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colours.text,
        textAlign: "center",
        marginBottom: 10
    },
    ProductText: {
        textAlign: "center",
        color: Colours.text
    },
    EcoReason: {
        textAlign: "center",
        color: Colours.text,
        fontSize: 16,
        fontWeight: "bold"
    },
    EcoConfidence: {
      color: Colours.text,
      fontSize: 13,
      opacity: 0.8,
      marginTop: 2,
      marginBottom: 4,
    },
    SavedFlatlist: {
        flex: 1,
        backgroundColor: Colours.background,
        margin: 0
    },
    SavedProductContainer: {
        backgroundColor: Colours.cards,
        padding: 10,
        margin: 10,
        borderRadius: 10,

        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    savedProduct: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    savedProductInfo: {
        display: "flex",
        flex: 1,
        marginLeft: 10,
        justifyContent: "space-between",
    },
    ecoContainer: {
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        backgroundColor: Colours.cards,
        borderRadius: 10,
        padding: 10,
        width: "92%",
        margin: "auto",

        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    ecoScoreLabel: {
        color: Colours.text,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
    },
    SectionTitle: {
        color: Colours.text,
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
    },
    SectionSubtitle: {
        color: Colours.text,
        fontSize: 16,
        marginBottom: 15,
        textAlign: "center",
    },
    nutritionContainer: {
        width: "92%",
        backgroundColor: Colours.cards,
        borderRadius: 18,
        padding: 18,
        margin: "auto",
        marginBottom: 20,

        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    subRow: {
        width: "90%",
        alignSelf: "flex-end",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5,
    },
    nutritionLabel: {
        color: Colours.text,
        fontSize: 17,
        fontWeight: "bold",
        flex: 1,
    },
    subLabel: {
        color: Colours.text,
        fontSize: 15,
    },
    rowRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minWidth: 90,
        justifyContent: "flex-end",
    },
    nutritionValue: {
        color: Colours.text,
        fontSize: 16,
        fontWeight: "bold",
    },
    rowDivider: {
        height: 1,
        backgroundColor: Colours.text,
        marginVertical: 5,
    },
    Image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        borderRadius: 15,
        alignSelf: "center",
        marginTop: 20,
    },
    nutritionRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 9,
    },
    levelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    levelText: {
        color: Colours.text,
        fontSize: 14,
        fontWeight: "bold",
    },
    productPageEcoScore: {
        color: Colours.text,
        fontSize: 26,
        fontWeight: "bold",
    },
    ingredientsContainer: {
        width: "92%",
        backgroundColor: Colours.cards,
        borderRadius: 18,
        padding: 18,
        marginTop: 20,
        margin: "auto",
        marginBottom: 40,

        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    ingredient: {
        color: Colours.text,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 5
    },
    ingredientRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    ingredientText: {
        color: Colours.text,
        fontSize: 16,
        flex: 1,
    },
    ingredientTextLow: {
        color: Colours.low,
        fontWeight: "bold",
    },
    ingredientTextMedium: {
        color: Colours.medium,
        fontWeight: "bold",
    },
    ingredientTextHigh: {
        color: Colours.high,
        fontWeight: "bold",
    }
})