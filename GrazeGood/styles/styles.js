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
        fontSize: 20,
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
        marginTop: 100
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
        flex: 1,
        textAlign: "left",
        color: Colours.text,
        fontSize: 16,
        fontWeight: "bold"
    },
    EcoConfidence: {
      color: Colours.text,
      fontSize: 13,
      opacity: 0.6,
      marginTop: 15,
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
        marginTop: 20,
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
        marginTop: 5
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

        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
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
        fontSize: 45,
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
    },
    Premiumtext: {
        color: Colours.text,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 5
    },
    logoutButton: {
        backgroundColor: Colours.button,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        width: "30%",
        alignSelf: "center"
    },
    ProfileImageContainer: {
        width: 120,
        height: 120,
        margin: "auto"
    },
    randomiseButton: {
        backgroundColor: Colours.accent,
        position: "absolute",
        bottom: 10,
        right: 15,
        width: 30,
        height: 30,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    PremiumIcon: {
        color: "#FFD725",
        width: 110,
        height: 110,
        position: "absolute",
        top: 15,
        right: 0
    },
    PremiumContainer: {
        width: "92%",
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
    DateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
        width: "100%",
    },
    MemberSinceText: {
        color: Colours.text,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 5,
        fontWeight: "bold"
    },
    PremiumDate: {
        color: Colours.text,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 5
    },
      switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,

    },
    switchLabel: {
        marginRight: 10,
        fontSize: 16,
        color: Colours.text
    },
    benefitsContainer: {
        marginVertical: 20,
        alignItems: "flex-start",
        fontSize: 14
    },
    benefit: {
        color: Colours.text,
        fontSize: 18,
        marginBottom: 5,
        backgroundColor: Colours.accent,
        padding: 10,
        borderRadius: 25
    },
    buyPremiumButton: {
        backgroundColor: Colours.button,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10
    },
    buyPremiumText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
    },
    input: {
        width: 200,
        alignSelf: "center",
        height: 40,
        margin: 12,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        backgroundColor: Colours.accent,
    },
    InputContainer: {
        borderRadius: 10,
        padding: 20,
        backgroundColor: Colours.cards,
        width: "92%",
        alignSelf: "center",
        marginTop: 20,

        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,

        justifyContent: "center",
        alignItems: "center",
    },
    welcomeContainer: {
        alignSelf: 'center',
        backgroundColor: Colours.cards,
        padding: 20,
        borderRadius: 10,
        width: "92%",
        marginTop: 20,

        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    welcomeText: {
        color: Colours.text,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 5
    },
    infoMessageContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 20,
    },
    infoIcon: {
        marginLeft: 20,
    },
    infoMessage: {
        color: Colours.text,
        fontSize: 16,
        flex: 1,
        marginLeft: 20
    },
    EcoCircle: {
        width: 130,
        height: 130,
        borderRadius: 65,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 20,
    },
    EcoScoreCircleContent: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    confidenceContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },
    confidenceIcon: {
        marginRight: 10,
        marginTop: 10,
        color: Colours.text,
        opacity: 0.6,
    },
    warningChip: {
        backgroundColor: "#fff3e6",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginTop: 10,

        justifyContent: "center",
        alignItems: "flex-start",

        flexDirection: "row",
        alignItems: "center",

        width: "80%",
        alignSelf: "center",

        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    EcoReasonIcon: {
        marginHorizontal: 14,
        color: Colours.text,
    },
    ProductPageTitle: {
        color: Colours.text,
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    EcoScoreVerdict: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: "500",
        marginHorizontal: 10,
        textAlign: "center",
        opacity: 0.85
    },
    ingredientReason: {
        color: Colours.text,
        fontSize: 13,
        opacity: 0.65,
        marginTop: 2,
    },
    showAllBtn: {
        backgroundColor: Colours.button,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        alignSelf: "center",
    },
    showAllText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
    },
    breakdownButton: {
        marginTop: 10,

        paddingVertical: 10,
        paddingHorizontal: 16,

        backgroundColor: Colours.cards,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        width: "92%",
        alignSelf: "center",
        justifyContent: "space-between",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 5
    },
    breakdownButtonText: {
        color: Colours.text,
        fontSize: 18,
        fontWeight: "bold",
    },
    breakdownContainer: {
        width: "92%",
        backgroundColor: Colours.cards,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        padding: 14,
        marginBottom: 10,
        alignSelf: "center",
        marginTop: -2,
    },
    breakdownContainerShadow: {
        width: "100%",
        alignSelf: "center",

        shadowColor: "#414040ff",
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,

        elevation: 2,
    },
    breakdownRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 8,
        gap: 8,
    },
    breakdownText: {
        flex: 1,
        color: Colours.text,
        fontSize: 13,
        lineHeight: 18,
        fontWeight: "bold"
    },
    warningChipSmall: {
        backgroundColor: "#fff3e6",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginTop: 10,

        justifyContent: "center",
        alignItems: "flex-start",

        flexDirection: "row",
        alignItems: "center",

        width: "80%",
        alignSelf: "center",

        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    breakdownTitle: {
        color: Colours.text,
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 3,
    },
    breakdownText: {
        color: Colours.text,
        fontSize: 13,
        opacity: 0.75,
        flex: 1,
    },
    EcoChipContainer: {
        backgroundColor: "#fff3e6",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginTop: 10,

        justifyContent: "space-between",
        alignItems: "flex-start",

        flexDirection: "column",
        alignItems: "flex-start",


        width: "95%",
        alignSelf: "center",

        shadowColor: "#414040ff",
        shadowOffset: {
        width: 1,
        height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    EcoChipText: {
        color: Colours.text,
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 3,
    },
    EcoChipIcon: {
        marginRight: 10
    },
    EcoChipSubText: {
        color: Colours.text,
        fontSize: 10,
        opacity: 0.6,
        fontWeight: "bold",
        flex: 1,
        marginTop: 5
    },
    saveButton: {
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: Colours.button,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        width: "50%",
        alignSelf: "center",
        justifyContent: "center",
    },
    saveButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    noBreakdowns: {
        color: Colours.text,
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 3,
        textAlign: "center",
        justifyContent: "center",
        alignSelf: "center"
    }
})