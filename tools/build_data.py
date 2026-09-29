import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from sources import S, src
EV = []
def E(id, dt, prec, title, desc, cat, pov, status, loc, scene, sources, related=None, note=None):
    EV.append(dict(id=id, datetime=dt, precision=prec, timeNote=note, title=title, description=desc,
                   category=cat, pov=pov, status=status, location=loc, scene=scene,
                   sources=src(*sources), related=related or []))
EST="-05:00"; EDT="-04:00"
F="established fact"; P="prosecution claim"; D="defense claim"
def T(who): return "testimony by "+who

# ---------------- MEDICAL HISTORY ----------------
E("mh-callan-birth","2022-05-26",  "day","Third child, Callan, is born",
  "Callan Clancy was born on May 26, 2022 (date as reported in the Wikipedia overview, citing trial coverage). Cora was born in December 2017 and Dawson in September 2019. Lindsay Clancy took maternity leave from her job as a labor and delivery nurse at Massachusetts General Hospital.",
  "medical-history",["evidence"],F,"Family home, Duxbury","house",["wiki","nbc_0727"])
E("mh-earlier-postpartum","2019-10","approximate","Postpartum anxiety after earlier births (background)",
  "The defense's position, stated in opening, is that she had postpartum symptoms after her second child and that this was significant because it can signal bipolar disorder (Reddington said an antidepressant like Zoloft in someone with bipolar disorder \"messes with your brain\"). Dr. Jennifer Tufts later testified Clancy reported trying Zoloft while postpartum with her second child. Exact dates are not established in the sources; placed approximately after Dawson's birth.",
  "medical-history",["lindsay"],D,"—","house",["wcvb_0727","cbs_day9"],note="Approximate: sources give no specific date.")
E("mh-tufts-start","2022-09","month","Begins telehealth psychiatric care with Dr. Jennifer Tufts",
  "Clancy began seeing psychiatrist Dr. Jennifer Tufts in September 2022. Tufts testified that anxiety was the main concern and that she recommended individual therapy and sertraline (Zoloft); Clancy was concerned about side effects and initially did not start it. The family's nanny began caring for Callan that month as Clancy prepared to return to work.",
  "medical-history",["evidence"],T("Dr. Jennifer Tufts"),"Telehealth","house",["cbs_day9","wcvb_0806"])
E("mh-leave-msg","2022-09-30","day","Portal message asking to extend maternity leave",
  "A Sept. 30, 2022 patient-portal message read in court said she had asked her employer to extend leave for postpartum anxiety/depression: \"I don't feel mentally well enough to return to taking care of patients with a baby at home that still won't take the bottle.\"",
  "medical-history",["evidence","lindsay"],F,"Telehealth portal","house",["cbs_day9"])
E("mh-zoloft","2022-10","month","Starts, then stops, Zoloft",
  "Per Tufts, Clancy began Zoloft after an early-October appointment, was \"feeling pretty poorly\" after starting it, and discontinued it. Patrick Clancy testified she took a total of seven pills of the Zoloft prescription before switching providers.",
  "medical-history",["evidence","patrick"],T("Dr. Jennifer Tufts / Patrick Clancy"),"—","house",["cbs_day9","wcvb_0727"])
E("mh-ativan","2022-10-21","day","Ativan prescribed for anxiety",
  "Tufts prescribed the lowest dose of Ativan on Oct. 21, 2022. On Oct. 26 Clancy reported less anxiety but continued insomnia and was using Benadryl to sleep; Buspar was suggested, but on Nov. 2 she said she had been \"too afraid to start a new medication.\" Tufts discussed tapering Ativan because of dependency risk.",
  "medical-history",["evidence"],T("Dr. Jennifer Tufts"),"Telehealth","house",["cbs_day9"])
E("mh-phone-note","2022-10-25","day","Phone note: struggling to parent a third child",
  "A long note Clancy wrote on her phone on Oct. 25, 2022 was read to jurors by State Police Sgt. Timothy Chiappini: \"I'm sad and depressed because I am not able to parent my third child like my first.\" The note also said she wanted to feel love and connection with all her kids.",
  "medical-history",["evidence","lindsay"],F,"Phone note","house",["globe_0813","cbs_key"])
E("mh-nov-er","2022-11-15","day","ER visit after going without sleep",
  "She sought emergency care on Nov. 15, 2022 after reportedly going two days without sleep; trazodone was prescribed. By mid-November her parents were visiting for days at a time to help. (Detail via the Wikipedia overview, which cites trial coverage.)",
  "medical-history",["evidence"],F,"Emergency room","hospital",["wiki"])
E("mh-journal-nov","2022-11-18","day","Journal entry about exhaustion",
  "In an entry dated Nov. 18, 2022, read in court: \"It's like I'm so desperate to get a mental break from taking care of everyone that my mind is trying to make something physically wrong with me.\"",
  "medical-history",["evidence","lindsay"],F,"Journal","house",["cbs_key"])
E("mh-perinatal","2022-11-20","approximate","Referred to a South Shore perinatal mental health clinic",
  "Susan Clancy (Patrick's mother, a nurse) testified she reached out to colleagues running a program for postpartum mothers and that Lindsay was \"begging for help.\" Tufts testified that by Nov. 22 Clancy had enrolled at a South Shore perinatal clinic and was going to start Prozac.",
  "medical-history",["evidence"],T("Susan Clancy / Dr. Jennifer Tufts"),"South Shore perinatal clinic","hospital",["globe_0818","cbs_day9","cbs_key"],note="Approximate: around Nov. 20-22, 2022.")
E("mh-seroquel","2022-11-30","approximate","Remeron and Seroquel prescribed by the perinatal clinic",
  "Around the start of December, the South Shore clinic had prescribed the antidepressant Remeron and the antipsychotic Seroquel (Tufts testimony about a Dec. 1 appointment). The Boston Globe's review of court records counted more than 30 prescriptions (13 psychiatric medications) from September 2022 to January 2023.",
  "medical-history",["evidence"],F,"—","house",["cbs_day9","globe_meds"],note="Approximate: late Nov./early Dec. 2022.")
E("mh-jollotta","2022-12","month","Nurse practitioner adjusts medications; bipolar disorder considered",
  "Psychiatric nurse practitioner Rebecca Jollotta testified that Patrick attended an appointment and spoke with her by phone: \"I believe he was concerned about her symptoms and he thought they started when she started being medicated.\" AP reported that one outpatient provider considered bipolar disorder in 2022, and that Clancy disagreed with that opinion at McLean.",
  "medical-history",[],T("Rebecca Jollotta"),"South Shore perinatal clinic","hospital",["cbs_key","pbs_mclean"])
E("mh-dec-intrusive","2022-12-01","day","Reports intrusive thoughts on Remeron",
  "Tufts testified that on Dec. 1 Clancy reported intrusive thoughts on Remeron and wanted to stop it: \"She said it was a feeling like I am going to die.\" She denied suicidal ideation but said she was close to it. Tufts advised a single point of contact for medications after Clancy said she kept \"reaching out to different people.\"",
  "medical-history",["evidence"],T("Dr. Jennifer Tufts"),"Telehealth","house",["cbs_day9"])
E("mh-big-spiral","2022-12","month","December 'big spiral': suicidal statements, thoughts about the children",
  "Patrick Clancy testified that her \"big spiral\" began in December 2022: she said she was suicidal and had thoughts about harming the children. \"The way she was describing it was that something might happen to the kids.\" He said he was not concerned for the children's safety: \"She wasn't showing any intention of harming the kids.\" Her parents came to stay.",
  "medical-history",["patrick"],T("Patrick Clancy"),"Family home","house",["wcvb_0727"])
E("mh-mother","2022-12","month","Mother recalls disclosure of fear of hurting the children",
  "Paula Musgrove testified her daughter sent texts asking her to stay the night and expressing concern about medications, and recalled a conversation in which Lindsay expressed a fear of hurting the children; Musgrove said she was not concerned because she was present.",
  "medical-history",["lindsay"],T("Paula Musgrove"),"Family home","house",["cbs_key","b25_mistrial"])
E("mh-hotlines","2022-12","month","Two crisis-hotline calls around the holidays",
  "Defense witnesses testified that Clancy called a suicide/crisis hotline (ASPIRE) twice around the holidays in late 2022. The defense says she was \"turned away\"; the Wikipedia overview reports neither hotline intervened because she did not have a plan to harm herself.",
  "medical-history",["lindsay"],D,"Phone","house",["globe_0818","b25_mistrial","wiki"])
E("mh-dec-er","2022-12-15","approximate","ER visit for suicidal thoughts; declines inpatient care",
  "Tufts testified that at a Dec. 16 appointment Clancy said she had gone to the Mass General emergency room with suicidal ideation but declined inpatient treatment. Patrick testified providers recommended a postpartum program in Rhode Island. Lamictal (a mood stabilizer) was added around this time.",
  "medical-history",["evidence","patrick"],T("Dr. Jennifer Tufts / Patrick Clancy"),"Massachusetts General Hospital ER","hospital",["cbs_day9","wcvb_0727","wiki"],note="Date of ER visit approximate (reported at Dec. 16 appointment).")
E("mh-wi","2022-12-20","approximate","One day at a Women & Infants (RI) postpartum day program",
  "Clancy joined a postpartum day program at Women & Infants Hospital of Rhode Island a few days before Christmas and was discharged after one day. The defense says the program indicated she was overmedicated; her civil complaint says the hospital ruled out postpartum depression and bipolar disorder based on an inadequate history.",
  "medical-history",["lindsay"],D,"Women & Infants Hospital, Providence RI","hospital",["bcom_lawsuit","b25_mistrial","cbs_60min"],note="Approximate: 'a few days before Christmas' 2022.")
E("mh-mclean-admit","2023-01-01","day","Voluntary admission to McLean Hospital",
  "After returning to the MGH emergency room on Dec. 31 with persistent suicidal thoughts, Clancy was admitted voluntarily to McLean Hospital (Belmont) early on New Year's Day 2023. McLean psychiatrist Dr. Alia Goodheart first saw her Jan. 3 and diagnosed \"major depressive disorder, severe without psychotic features,\" tapering an antipsychotic used for sleep.",
  "medical-history",["evidence","patrick"],F,"McLean Hospital, Belmont","hospital",["cbs_day9","pbs_mclean","wcvb_0727"])
E("mh-mclean-discharge","2023-01-05","day","Discharged from McLean after about five days",
  "Goodheart testified Clancy reported she could sleep and was eager to be home for Cora's belated birthday party; she was discharged Jan. 5 with a two-week supply of Ativan and trazodone. \"She had never stated that she had any thoughts of harming anybody else.\" The defense emphasized the team did not speak with her prior outpatient clinicians; Goodheart said she had not treated postpartum psychosis.",
  "medical-history",["evidence","patrick"],T("Dr. Alia Goodheart"),"McLean Hospital","hospital",["pbs_mclean","cbs_day9"])
E("mh-tufts-jan6","2023-01-06","day","Outpatient psychiatrist notes she is 'deteriorating'",
  "At a virtual appointment the day after discharge, Tufts noted Clancy appeared \"deteriorating\": \"She appeared a little bit worse.\" Further appointments followed Jan. 9, 16 and 23 with medication changes.",
  "medical-history",["evidence"],T("Dr. Jennifer Tufts"),"Telehealth","house",["cbs_day9","globe_meds"])
E("mh-cora-party","2023-01-07","day","Cora's belated birthday party",
  "Per 60 Minutes, Lindsay made it home in time to celebrate Cora's birthday on Jan. 7. Patrick testified she seemed \"much better\" after discharge (as reported by E! News citing CNN).",
  "medical-history",["patrick"],T("Patrick Clancy"),"Family home","house",["cbs_60min","eonline"])
E("mh-voice-complaint","2023-01-12","approximate","Civil complaint: hallucinations returned within a week of discharge",
  "Her January 2026 malpractice complaint alleges auditory hallucinations for weeks before the killings, returning within a week of McLean discharge, including a voice saying \"You will never be the same. The only option is to die.\" Prosecutors dispute this: they emphasize she never told anyone she heard voices before Jan. 24 (see trial testimony).",
  "medical-history",["lindsay"],D,"—","house",["bcom_lawsuit","globe_0820"],note="Approximate: 'within a week' of Jan. 5 discharge, per complaint.")
E("mh-texts-mother","2023-01-14","day","Texts with her mother: 'waiting for the day I wake up feeling like me'",
  "Texts read in court: on Jan. 10 she told her mother she was at the gym with her kids; on Jan. 12 her mother asked \"still feeling a little better?\" (reply: \"A little bit\"); on Jan. 14 she wrote \"...hanging in there and waiting for the day I wake up feeling like me.\"",
  "medical-history",["evidence","lindsay"],F,"Text messages","house",["globe_0813"])
E("mh-search-hallu","2023-01-19T10:33"+EST,"exact","Searches: 'schizophrenia' (8:58 a.m.), 'hallucinations' (10:33 a.m.)",
  "State Police Sgt. Timothy Chiappini testified the phone was used on Jan. 19 to look up schizophrenia at 8:58 a.m. and hallucinations at 10:33 a.m. The defense cites such searches as evidence of emerging psychosis.",
  "investigation",["evidence"],F,"Phone","house",["globe_0813"])
E("mh-search-sociopath","2023-01-20T20:30"+EST,"approximate","Search: 'Can you treat a sociopath?', then psychosis (~10 min later)",
  "Four days before the killings, at around 8:30 p.m., the phone searched \"Can you treat a sociopath?\" (prosecution direct); on cross, Chiappini confirmed a search about psychosis about 10 minutes later. A search about benzo withdrawal was also made Jan. 20. Her complaint says she researched whether she was a psychopath.",
  "investigation",["evidence"],F,"Phone","house",["globe_0813","bcom_lawsuit"],note="'Around 8:30 p.m.' per testimony.")
E("mh-search-suicide","2023-01","month","Suicide-related searches (disputed characterization)",
  "Investigators testified about searches on suicide methods; a Wikipedia page on suicide methods was accessed on a household computer in Aug. 2022, though they could not say who searched. Reddington cited a defense phone extraction showing a search about \"how to slit your throat to die\" and asked prosecutors not to describe the searches as \"ways to kill\"; he characterized them as searches for suicide methods.",
  "investigation",["lindsay"],D,"Phone / household computer","house",["globe_0813","wbur_0729"])
E("mh-tufts-jan23","2023-01-23","day","Last psychiatric appointment, the day before",
  "Tufts testified that on Jan. 23 Clancy reported \"no motivation, numb\" and said she had to force herself out of bed; she denied suicidal or homicidal ideation. \"There were no signs of psychosis or mania.\" Tufts did not recommend hospitalization.",
  "medical-history",["evidence"],T("Dr. Jennifer Tufts"),"Telehealth","house",["cbs_day9","cbs_key"])

# ---------------- DAY OF: JAN 24, 2023 ----------------
d="2023-01-24T"
E("d-pediatric",d+"09:00"+EST,"approximate","Morning pediatrician visit with Cora",
  "Clancy took 5-year-old Cora to a pediatric appointment (Patrick testified she had become preoccupied with Cora's stomachache, per the Wikipedia overview). At arraignment prosecutors said the receptionist, nurses and doctor noticed no issues. Exact time not given in sources.",
  "day-of",["evidence"],F,"Pediatrician's office (off-site)","offsite",["nbc_arraign","wiki"],note="Time unknown; 'morning'.")
E("d-best-day",d+"12:00"+EST,"approximate","Patrick: 'having one of her best days'",
  "Patrick, working from his basement home office, testified they exchanged photos of the children that day, including Dawson, who had dressed himself for the first time, and that Lindsay seemed happy, \"having one of her best days.\"",
  "day-of",["patrick"],T("Patrick Clancy"),"Basement office","basement-office",["wcvb_0727","wbur_0729"],note="Time approximate (during the day).")
E("d-snowman",d+"14:00"+EST,"approximate","Snowman with the children in the backyard",
  "Prosecutors said she went outside with Cora and Dawson, built a snowman and texted photos to her mother and husband with no sign of distress. WBUR reports the snowman was built in the backyard while Patrick worked in the basement office.",
  "day-of",["evidence","patrick"],F,"Backyard","backyard",["nbc_arraign","wbur_0729"],note="Time approximate (afternoon).")
E("d-voice-afternoon",d+"15:45"+EST,"approximate","Her account: a loud male voice in the late afternoon",
  "Prosecution rebuttal psychiatrist Dr. Avram Mack testified Clancy told him she heard a loud male voice in the late afternoon, saying \"to the effect of, 'you should kill the kids, this is your last chance so that you can kill yourself.'\" Her complaint says hallucinations and suicidal thoughts continued \"nonstop\" in the hours before. Prosecution experts said a single-occasion voice was unusual and that her accounts varied.",
  "day-of",["lindsay"],D,"Main floor (location not established)","living",["cbs_day18","bcom_lawsuit","guardian_0825"],note="'Late afternoon' per Mack; exact time unknown.")
E("d-search-miralax",d+"16:02"+EST,"exact","Search: 'kids Miralax'",
  "The phone searched \"kids Miralax\" at 4:02 p.m. (prosecution timeline at arraignment; digital-forensics testimony also cited \"Kids miralax\" and \"CVS pharmacy\" searches that day). Prosecutors cast this as the start of a plan; the defense disputes that inference.",
  "day-of",["evidence"],F,"Phone (room not established)","kitchen",["nbc_arraign","eonline"])
E("d-search-threev",d+"16:13"+EST,"exact","Search: takeout from ThreeV; Apple Maps drive time",
  "At 4:13 p.m. she searched for takeout from ThreeV, a restaurant in Plymouth, then used Apple Maps to check the drive time. In closing, prosecutor Jennifer Sprague cited this as evidence of planning.",
  "day-of",["evidence"],F,"Phone (room not established)","kitchen",["nbc_arraign","cbs_key"])
E("d-cvs-call",d+"16:47"+EST,"exact","Phone call to the Kingston CVS",
  "She called the Kingston CVS asking about kids' Miralax; the manager said it was out of stock but similar products were available. Manager Angela Krause testified it was a \"normal interaction.\" (Oxygen reports 4:48 p.m.)",
  "day-of",["evidence"],F,"Phone (room not established)","kitchen",["nbc_arraign","wcvb_0729","oxygen"],note="4:47 p.m. per arraignment timeline; 4:48 per another report.")
E("d-text-takeout",d+"16:53"+EST,"exact","Text to Patrick: takeout from ThreeV?",
  "Text read in court: \"Any chance you want to do take out from ThreeV\" … \"I didn't cook anything. It's been a long day.\" Patrick replied yes; she wrote \"Okie dokie, check the menu when you can.\" He asked if Callan was up from his nap: \"It was just a short nap.\" Prosecutors said ThreeV was farther than their usual takeout.",
  "day-of",["evidence","patrick"],F,"Text messages (Patrick in basement office)","basement-office",["eonline","nbc_arraign"])
E("d-order-choices",d+"17:06"+EST,"exact","Dinner choices exchanged by text",
  "At about 5:06-5:07 p.m. she said she'd have a Mediterranean Power Bowl; a minute later he chose a scallop and pork belly risotto.",
  "day-of",["evidence","patrick"],F,"Text messages","kitchen",["nbc_arraign","eonline"],note="5:06 per arraignment timeline; 5:07 per texts read at trial.")
E("d-threev-call",d+"17:10"+EST,"exact","Order phoned in to ThreeV",
  "She called ThreeV and placed the order. Hostess Saria Shelgren testified she had no trouble understanding the caller and it was a normal interaction.",
  "day-of",["evidence"],F,"Phone","kitchen",["nbc_arraign","wcvb_0729"])
E("d-last-unlock",d+"17:13"+EST,"exact","Phone last unlocked",
  "Digital forensics expert Ian Whiffin testified her phone was last unlocked at 5:13 p.m.",
  "day-of",["evidence"],F,"Phone","kitchen",["eonline"])
E("d-patrick-leaves",d+"17:15"+EST,"approximate","Patrick leaves on the errands",
  "Patrick left around 5:15 p.m. to pick up dinner and medicine for Cora. He testified his last memory of the children was Dawson on the couch eating chicken nuggets and green beans (per AP, via Oxygen), and that he kissed one of the children on the head and said he'd \"be right back\" (E! citing CNN). Prosecutors call the errands a ruse to get him out of the house; the defense disputes that the evening was planned.",
  "day-of",["evidence","patrick"],T("Patrick Clancy"),"Living room, front door, driveway","entry",["nbc_arraign","oxygen","eonline","nbc_view"],note="'About 5:15 p.m.' per prosecutors.")
E("d-pedialax-text",d+"17:16"+EST,"approximate","Text: 'Pedia-Lax liquid stool softener'",
  "A short time after he left, she texted \"Pedia-Lax liquid stool softener.\"",
  "day-of",["evidence","patrick"],F,"Text message","living",["nbc_arraign"],note="'A short time later'; exact minute not reported.")
E("d-voice-loud",d+"17:17"+EST,"approximate","Her account: after he left, the voice became loud and demanding",
  "Per her civil complaint and the defense opening, after Patrick left the voice said: \"This is your last chance. Kill the children so you can kill yourself.\" Resnick testified she described a \"command hallucination.\" The prosecution disputes that a voice drove her actions, noting she reported it only after the killings.",
  "day-of",["lindsay"],D,"Main floor (location not established)","living",["bcom_lawsuit","eonline","cbs_day18"],note="Approximate: 'after her husband left'.")
E("d-basement-account",d+"17:20"+EST,"approximate","Her account: a 'dream-like state' in the basement",
  "The complaint says she entered a dissociative \"dream-like state\" and \"lost all control\" as the children died in the basement; she described saying \"go to God\" (also reported by Dr. Mack). Resnick: \"It was almost like she was a puppet and someone else was pulling the strings.\" The defense did not contest at trial that she caused the children's deaths; her mental state was the dispute.",
  "day-of",["lindsay"],D,"Basement","basement-den",["bcom_lawsuit","cbs_day18","cbs_key"],note="Exact time not established; see competing timing claims.",related=["d-pros-timing"])
E("d-watch-stops",d+"17:23"+EST,"exact","Apple Watch stops recording",
  "On cross-examination the defense noted her Apple Watch stopped recording at 5:23 p.m. Her last recorded heart rate was 57 bpm (Whiffin).",
  "day-of",["evidence"],F,"—","living",["eonline"])
E("d-pros-timing",d+"17:25"+EST,"approximate","Prosecution: the children were killed before the 5:33 call",
  "Sprague argued that when Patrick called at 5:33 p.m., \"she had already strangled them,\" citing phone data that showed the phone going upstairs about three minutes after the call ended. Prosecutors also argued the voice gave no direction, so she chose the place, method and means.",
  "day-of",[],P,"Basement","basement-den",["ct_incons","wiki"],note="A prosecution inference, not a recorded time.",related=["d-def-phone"])
E("d-cvs",d+"17:32"+EST,"exact","Patrick on CVS surveillance in Kingston",
  "Surveillance showed Patrick at the Kingston CVS at 5:32 p.m., going to the children's medicine aisle. (Distance from the home is reported differently: about a mile (AP) vs. a little over 2 miles (Oxygen).)",
  "day-of",["evidence","patrick"],F,"CVS, Kingston (off-site)","cvs",["nbc_arraign","oxygen","nbc_view"])
E("d-call-533",d+"17:33"+EST,"exact","Patrick calls Lindsay; no answer",
  "Phone records show Patrick called her at 5:33 p.m.; the call was not answered.",
  "day-of",["evidence","patrick"],F,"CVS (Patrick) / home (Lindsay)","cvs",["nbc_arraign","eonline"])
E("d-call-534",d+"17:34"+EST,"exact","She calls back: 14 seconds, from the lock screen",
  "She called back at 5:34 p.m.; the 14-second call was about which medication to buy. Whiffin said it was likely placed from the locked screen. Prosecutors said Patrick called it \"completely normal\" but later said she seemed to be in the middle of something.",
  "day-of",["evidence","patrick"],F,"CVS (Patrick) / home (Lindsay)","cvs",["nbc_arraign","eonline"])
E("d-stairs",d+"17:36"+EST,"approximate","Phone health data: stair-climbing events (times reported inconsistently)",
  "Apple Health data recorded stair climbing. Reports differ: E! News reported flights at 5:03 and 5:33 p.m.; CT Insider reported the prosecution said the phone went upstairs about three minutes after the 5:34 call ended. The defense challenged the data's reliability.",
  "day-of",["evidence"],F,"Main stairs (inferred)","stairs-main",["eonline","ct_incons"],note="Approximate and inconsistent across reports; shown here at ~5:36 p.m.",related=["d-def-phone","d-pros-timing"])
E("d-cvs-leave",d+"17:37"+EST,"exact","Patrick leaves CVS",
  "He left CVS at 5:37 p.m. after buying Pedia-Lax and a package of Skittles (CVS manager's testimony, via Oxygen).",
  "day-of",["evidence","patrick"],F,"CVS, then road to Plymouth","road",["nbc_arraign","oxygen"])
E("d-def-phone",d+"17:38"+EST,"approximate","Defense: the phone could have been left in the bedroom",
  "Reddington told jurors the phone may simply have been left upstairs: \"Was it left on the bed and left there for 20 minutes?\" In his view the data does not show where she was.",
  "day-of",["lindsay"],D,"Bedroom (second floor)","bedroom",["ct_incons"])
E("d-phone-stops",d+"17:38"+EST,"exact","Phone stops recording motion data",
  "The defense noted the phone stopped recording motion/health data at 5:38 p.m.",
  "day-of",["evidence"],F,"—","stairs-main",["eonline"])
E("d-bedroom-evidence",d+"17:45"+EST,"approximate","Bedroom: self-inflicted wounds (time unknown)",
  "It is undisputed she cut her wrists and neck in the second-floor bedroom. Duxbury Det. Marcanthony Maffeo testified to blood along the edge of the bed, furniture and wall, on the windowsill, the window ledge and two shingles below. A knife was recovered; investigators could not obtain usable fingerprints from it or the bands (via Wikipedia).",
  "day-of",["evidence"],F,"Primary bedroom (second floor)","bedroom",["globe_0731","wiki"],note="Time unknown; between about 5:38 and 6:09 p.m.",related=["d-wounds-def","d-wounds-pros"])
E("d-wounds-def",d+"17:46"+EST,"approximate","Defense: wounds show a genuine suicide attempt",
  "Defense forensic pathologist Dr. Elizabeth Laposata testified the injuries included \"hesitation marks,\" a \"classic finding in suicide attempts,\" and caused \"significant bloodshed.\" The defense argued the cold and dark may explain the limited bleeding responders saw.",
  "day-of",["lindsay"],D,"Primary bedroom","bedroom",["globe_0818","globe_0730"])
E("d-wounds-pros",d+"17:47"+EST,"approximate","Prosecution: wounds were superficial",
  "Prosecutors highlighted responders' testimony that the wounds were not bleeding heavily and suggested wrist wounds were not sutured until the next day and the neck wound never needed sutures. In closing, however, Sprague said there was no dispute she tried to kill herself (via Wikipedia).",
  "day-of",[],P,"Primary bedroom","bedroom",["globe_0730","wiki"])
E("d-screen",d+"17:50"+EST,"approximate","Window screen found pushed up, not cut",
  "An evidence photo shows the bedroom window screen was pushed upward, not slashed. Prosecution psychiatrist Dr. Gregory Saathoff testified Clancy told him she slashed the screen with a knife.",
  "day-of",["evidence"],F,"Bedroom rear window","bedroom-window",["ct_incons"],note="Time unknown.",related=["d-screen-def"])
E("d-screen-def",d+"17:51"+EST,"approximate","Defense: memory of slashing the screen was a delusion",
  "\"She was in a psychosis when she thought that,\" Reddington told the jury about her recollection that she cut the screen.",
  "day-of",["lindsay"],D,"Bedroom rear window","bedroom-window",["ct_incons"])
E("d-jump",d+"17:55"+EST,"approximate","Fall from the second-floor window",
  "She went out the second-floor bedroom window and landed in the backyard, suffering spinal injuries that left her paralyzed from the waist down. Laposata (defense) said the spinal injury was consistent with a headfirst landing; prosecutors suggested she clung to the sill before falling.",
  "day-of",["evidence","lindsay"],F,"Rear window to backyard","backyard",["globe_0818","globe_0731","wiki"],note="Time unknown; before 6:09 p.m.")
E("d-threev",d+"17:54"+EST,"exact","Patrick picks up takeout at ThreeV",
  "Per the prosecution timeline at arraignment, Patrick picked up the takeout order at ThreeV in Plymouth at 5:54 p.m.; surveillance footage from the stop was shown to jurors at trial. He then drove home.",
  "day-of",["evidence","patrick"],F,"ThreeV Restaurant, Plymouth (off-site)","threev",["nbc_arraign","oxygen"])
E("d-home",d+"18:09"+EST,"exact","Patrick returns: the house is quiet",
  "Patrick arrived home at about 6:09 p.m.; he testified \"the house was really quiet.\" Phone records show an unanswered call from him to her phone at 6:09 p.m. He called down to the basement.",
  "day-of",["evidence","patrick"],T("Patrick Clancy"),"Driveway, front door","entry",["nbc_arraign","cbs_key","eonline","ct_incons"])
E("d-locked",d+"18:10"+EST,"approximate","Bedroom door locked; blood and an open window",
  "He found the bedroom door locked and \"knew something was wrong.\" Once inside he \"saw blood everywhere, and the window was open.\"",
  "day-of",["patrick"],T("Patrick Clancy"),"Primary bedroom","bedroom",["wcvb_0729","cbs_key"])
E("d-yard",d+"18:10"+EST,"approximate","He finds her in the backyard",
  "He ran outside and found her \"face up\" in the yard: \"She had deep cuts on her wrists. She had a red line across her neck.\" He testified she said \"I tried to kill myself\" and that the children were in the basement, without indicating they were hurt.",
  "day-of",["patrick"],T("Patrick Clancy"),"Backyard, below bedroom window","backyard",["wcvb_0729","cbs_key","ct_incons"],related=["d-yard-def"])
E("d-yard-def",d+"18:10"+EST,"approximate","Defense: that conversation could not have happened",
  "Reddington argued her injuries made such a conversation impossible and pointed jurors to the 911 recording, on which her words are unclear. Prosecutors said Patrick could understand her and relayed her answers to the dispatcher.",
  "day-of",["lindsay"],D,"Backyard","backyard",["ct_incons"])
E("d-911",d+"18:11"+EST,"exact","911 call (about seven minutes)",
  "Duxbury Police received the 911 call at approximately 6:11 p.m. On the seven-minute recording Patrick is heard telling her to \"wake up\"; she moans and struggles to speak. After paramedics arrived he went inside and was heard screaming \"She killed the kids.\" A judge barred public release of the recording.",
  "day-of",["evidence","patrick"],F,"Backyard, then house","backyard",["da_1026","wbur_0729","globe_911rule"])
E("d-responders",d+"18:15"+EST,"approximate","First responders arrive",
  "Duxbury Officer Stephen Hall heard a man calling for help from the backyard and found Lindsay with cuts to her wrists and neck, then heard a loud scream from inside. Fire Capt. PJ Hussey issued an \"all call\"; the scene \"turned very chaotic very quickly.\"",
  "day-of",["evidence"],T("Duxbury first responders"),"Backyard","backyard",["globe_0730","cbs_key"],note="Arrival minute not reported in sources.")
E("d-basement",d+"18:16"+EST,"approximate","The children are found in the basement",
  "Patrick found Cora and Callan on the floor of the finished basement's den and Dawson alone in his basement office, each with an exercise band around the neck. He removed the bands and tried to help them. Officers carried Dawson out to EMTs; responders performed CPR on Cora and Callan.",
  "day-of",["evidence","patrick"],F,"Basement den and office","basement-den",["nbc_arraign","wcvb_0729","globe_0730"],note="Minute not reported; during the 911 call.")
E("d-patrick-distress",d+"18:25"+EST,"approximate","Patrick in shock; ambulance requested for him",
  "Officer Brian Josephine said Patrick was \"frantic, kind of in shock\" upstairs, and responders requested an ambulance for him as well.",
  "day-of",["patrick","evidence"],T("Officer Brian Josephine"),"Main floor","living",["globe_0730"])
E("d-transport",d+"18:40"+EST,"approximate","Transport: children to BID-Plymouth; Lindsay to South Shore Hospital",
  "Cora and Dawson were taken to Beth Israel Deaconess Hospital-Plymouth and pronounced dead there; Callan regained a heartbeat about 10 minutes after arrival and was flown to Boston Children's Hospital. Lindsay went to South Shore Hospital, then to the Brigham and Women's ICU (arriving early Jan. 25).",
  "day-of",["evidence"],F,"Hospitals (off-site)","hospital",["da_1026","globe_0731","wcvb_0806"],note="Departure times not reported.")
E("d-dawson-728",d+"19:28"+EST,"exact","Dawson declared dead at 7:28 p.m.",
  "Emergency physician Dr. Mark Tenerowicz testified resuscitation efforts continued about 40 minutes at the hospital; Dawson was declared dead at 7:28 p.m.",
  "day-of",["evidence"],F,"Beth Israel Deaconess Hospital-Plymouth","hospital",["globe_0731"])
E("d-search-warrant",d+"21:00"+EST,"approximate","Search warrant at the home; State Police investigate",
  "Duxbury Police contacted the State Police detective unit. Det. Maffeo went to South Shore Hospital (she was sedated and unresponsive), then returned to the home where police were executing a search warrant. Police eventually executed 11 search warrants (via Wikipedia).",
  "investigation",["evidence"],F,"Home / South Shore Hospital","house",["globe_0731","da_1026","wiki"],note="Time approximate (that night).")
E("a-toxicology",d+"20:00"+EST,"approximate","Toxicology on her blood sample",
  "Toxicologist Dr. Justin Brower testified the medications found (including mirtazapine, lamotrigine, trazodone and quetiapine) were not at toxic levels and were \"not consistent\" with an overdose attempt; on cross he agreed the numbers \"do not tell the entire story.\" Saathoff testified she told him she took pills in lemonade (via Wikipedia).",
  "investigation",["evidence"],T("Dr. Justin Brower"),"Lab","hospital",["wcvb_0806","eonline","wiki"],note="Blood drawn at hospital that night; time approximate.")

# ---------------- AFTERMATH / LEGAL ----------------
E("a-arrest-warrant","2023-01-25","day","Arrest warrant; initial charges",
  "Authorities obtained an arrest warrant charging murder (Cora, Dawson), strangulation and assault counts; a third murder charge followed Callan's death (via Wikipedia). She went into cardiac arrest in the ICU early Jan. 25 and was resuscitated (ICU nurse testimony).",
  "legal",["evidence"],F,"—","court",["wiki","wcvb_0806"])
E("a-biswas","2023-01-26","day","Intubated, she writes questions to a forensic psychiatrist",
  "Forensic psychiatrist Dr. Jhilam Biswas testified that, unable to speak, Clancy wrote questions including \"Is my body broken?\" and \"Do I have an attorney?\" (via Wikipedia, citing trial coverage).",
  "investigation",["lindsay"],T("Dr. Jhilam Biswas"),"Brigham and Women's Hospital","hospital",["wiki"])
E("a-cause","2023-01-27","day","Callan dies; medical examiner rules asphyxia",
  "Callan was removed from life support on Jan. 27, 2023 at Boston Children's Hospital. The Office of the Chief Medical Examiner found Cora and Dawson died of asphyxia and Callan of complications of asphyxia. Patrick told 60 Minutes he was able to hold him: \"he died in my arms.\"",
  "investigation",["evidence","patrick"],F,"Boston Children's Hospital","hospital",["da_1026","wcvb_0806","cbs_60min"])
E("a-statement","2023-01-28","approximate","Patrick publicly forgives Lindsay",
  "In the days after, Patrick wrote tributes to each child and publicly forgave Lindsay, later telling 60 Minutes: \"I believe that it was her mental illness that caused that.\"",
  "media",["patrick"],T("Patrick Clancy (60 Minutes)"),"Online statement","offsite",["cbs_60min"],note="'In the days after'; exact date not in cited source.")
E("a-proxy","2023-01-29","day","Changes health-care proxy to her parents",
  "Dr. Sejal Shah testified that Clancy was initially confused after spinal surgery, later denied suicidal or homicidal thoughts, and asked to change her health-care proxy from her husband to her parents.",
  "investigation",["evidence"],T("Dr. Sejal Shah"),"Brigham and Women's Hospital","hospital",["wcvb_0806"])
E("a-chaplain","2023-01-31","day","Chaplain: 'I'm so glad that my children are safe'",
  "Brigham chaplain Sheila Cavanaugh testified that on Jan. 31, 2023 Clancy said \"I'm so glad that my children are safe,\" and described a \"persistent\" male voice. On cross, the prosecution noted Cavanaugh's detailed notes never recorded a voice; Cavanaugh said her notes were not verbatim: \"I'm not there to evaluate the patient, I'm there to give witness to their suffering.\"",
  "trial-testimony",["lindsay"],T("Sheila Cavanaugh (chaplain)"),"Brigham and Women's Hospital","hospital",["globe_0820"])
E("a-zeizel-call","2023-02-06","approximate","Hospital phone call to Patrick: 'a man's voice'",
  "Defense psychologist Paul Zeizel's first visit was 11 days after the killings (a call to Patrick went unanswered); two days later Clancy reached Patrick on Zeizel's phone, on speaker. Patrick testified: \"She said she heard a man's voice telling her that if she didn't do it now she would lose her chance, or something like that.\" A trooper testified investigators floated a theory that Zeizel coached her but found no evidence; Zeizel denied it (\"Absolutely not\").",
  "trial-testimony",["lindsay","patrick"],T("Patrick Clancy / Dr. Paul Zeizel"),"Brigham and Women's Hospital / phone","hospital",["globe_0818","wcvb_0729"],note="Date derived: '11 days' after Jan. 24 plus 'two days later' = about Feb. 6; approximate.")
E("a-arraign","2023-02-07","day","District Court arraignment from hospital bed",
  "Arraigned by video from her hospital bed; not guilty pleas entered. Prosecutors laid out their minute-by-minute timeline and said she was not suffering from postpartum depression. Reddington: \"This is not a situation that was planned, by any means\" and it was \"clearly a result of mental illness.\" A private funeral for the children was held the preceding Friday.",
  "legal",["evidence"],F,"Plymouth District Court (virtual)","court",["nbc_arraign"])
E("a-nyc","2023-04","month","Patrick moves to New York City",
  "Patrick told 60 Minutes he realized he could not stay in Duxbury and moved to New York City that April.",
  "media",["patrick"],T("Patrick Clancy (60 Minutes)"),"New York City","offsite",["cbs_60min"])
E("a-tewksbury","2023-05-01","approximate","Transferred to Tewksbury State Hospital",
  "Court records reported May 1, 2023 showed she had been transferred to Tewksbury State Hospital, where she has been held since.",
  "legal",["evidence"],F,"Tewksbury State Hospital","hospital",["globe_tewks","patriot_0928"],note="Reported May 1, 2023; transfer date approximate.")
E("a-indict","2023-09-15","day","Grand jury indictment",
  "A Plymouth County grand jury indicted her on three counts each of murder and strangulation. The DA's release says detectives developed probable cause that she acted with deliberate premeditation and extreme atrocity and cruelty.",
  "legal",["evidence"],F,"Plymouth County","court",["da_1026","nbc_indict"])
E("a-sc-arraign","2023-10-26","day","Superior Court arraignment at Tewksbury",
  "Arraigned at Tewksbury State Hospital; pleaded not guilty and held without bail.",
  "legal",["evidence"],F,"Tewksbury State Hospital (virtual)","court",["da_1026"])
E("a-divorce","2024-02","month","Patrick files for divorce",
  "Patrick filed for divorce in February 2024 (via Wikipedia). CBS News reports they have since divorced.",
  "legal",["patrick"],F,"—","court",["wiki","cbs_key"])
E("a-psych-exam","2025-01-14","day","Ordered to undergo examination by prosecution experts",
  "The court ordered her to undergo a psychiatric examination with prosecution experts (via Wikipedia, citing NBC10 Boston).",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["wiki"])
E("a-venue","2025-11-18","day","Venue change denied; trial moved to July 20, 2026",
  "Judge William F. Sullivan denied a defense request to move the trial and agreed to delay the start to July 2026.",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["bcom_venue","b25_venue"])
E("a-civil","2026-01-22","day","Civil malpractice suits filed by Lindsay and by Patrick",
  "Lindsay's complaint (Norfolk Superior Court) alleges a \"catastrophic failure\" by providers including McLean, Women & Infants, Dr. Tufts, NP Jollotta and their employers; it describes the voice and a \"dream-like state.\" Patrick filed a separate wrongful-death suit against Tufts, Jollotta, Aster Mental Health and South Shore Health. Allegations are unproven; some defendants deny wrongdoing.",
  "legal",["lindsay","patrick"],D,"Norfolk Superior Court","court",["bcom_lawsuit","complaint_pdf","cbs_60min"])
E("a-first-inperson","2026-02-20","day","First in-person court appearance since arrest",
  "Clancy appeared in person on Feb. 20, 2026; earlier hearings were by Zoom from Tewksbury. She appeared in person again at a June 18 pretrial hearing.",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["patriot_0928"])
E("a-stipulate","2026-04-07","day","Defense offers to stipulate she caused the deaths",
  "After a request for a two-phase (bifurcated) trial was denied on March 31, the defense offered to formally stipulate to her involvement if the trial were split; prosecutors declined to agree to stipulations. The judge denied reconsideration on April 22 (via Wikipedia).",
  "legal",["lindsay"],D,"Plymouth Superior Court","court",["globe_stip","wcvb_bifurc","wiki"])
E("a-remarry","2026-04","month","Patrick remarries",
  "Patrick married Dr. Rachel Danis in April 2026 (CBS). Both became targets of online conspiracy theories during the trial, which they reject.",
  "media",["patrick"],F,"New York City","offsite",["cbs_60min","cnn_holdout"])
E("a-nolle","2026-07-10","approximate","Strangulation counts dropped as 'redundant'",
  "Prosecutors filed a nolle prosequi on the three strangulation counts, saying they are subsumed into the murder charges.",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["wcvb_0727"],note="Early July 2026; exact filing date approximate.")
E("a-jury-select","2026-07-20","day","Jury selection begins",
  "Trial began with jury selection July 20; 18 jurors (12 women, six men) were seated, six to be designated alternates later. The judge denied sequestration.",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["wcvb_0727"])
E("a-911-ruling","2026-07-24","day","911 call and autopsy photos barred from public release",
  "On Patrick Clancy's motion, the judge ruled the 911 recording and autopsy photos could be presented to jurors but not recorded, displayed or distributed publicly.",
  "legal",["evidence","patrick"],F,"Plymouth Superior Court","court",["globe_911rule","cbs_911rule"])

# ---------------- TRIAL ----------------
E("t-open-pros","2026-07-27T09:30"+EDT,"approximate","Prosecution opening: 'not a woman in the throes of psychosis'",
  "The Commonwealth told jurors: \"This was not a woman in the throes of psychosis on January 24th, 2023. This was a woman who acted intentionally, rationally and swiftly to accomplish a very specific goal to kill.\" (The Boston Globe attributes the line to ADA Shanan Buckingham; Boston 25 to ADA Jennifer Sprague.) Prosecutors described her as controlling and manipulative.",
  "trial-testimony",[],P,"Plymouth Superior Court","court",["globe_meds","b25_open","wcvb_0727"],note="Morning session; minute approximate.")
E("t-open-def","2026-07-27T10:30"+EDT,"approximate","Defense opening: postpartum psychosis and overmedication",
  "Reddington said his client knows she killed her children but questioned what was going on in her mind; he argued possible bipolar disorder worsened by antidepressants (\"It messes with your brain\") and presented a list of prescriptions. He showed hospital photos of her injuries to counter any suggestion the suicide attempt was fake.",
  "trial-testimony",["lindsay"],D,"Plymouth Superior Court","court",["wcvb_0727","globe_meds","globe_open"],note="Morning session; minute approximate.")
E("t-patrick-1","2026-07-27T13:00"+EDT,"approximate","Patrick Clancy testifies (day 1)",
  "First witness. He described each birth, her anxiety about returning to work, medication changes, the December spiral, the McLean stay, and that on Jan. 24 she seemed to be \"having one of her best days.\"",
  "trial-testimony",["patrick"],T("Patrick Clancy"),"Plymouth Superior Court","court",["wcvb_0727","nbc_0727"],note="Afternoon; minute approximate.")
E("t-patrick-2","2026-07-29","day","Patrick testifies (day 2); 911 call played; CVS and restaurant staff",
  "Patrick described the evening; the 911 call was played while he was out of the room (Lindsay sobbed; a recess followed). He was excused before the bands and clothing were shown. CVS manager Angela Krause and ThreeV hostess Saria Shelgren described normal phone calls. On cross, the defense focused on her treatment and on pill bottles police did not seize. Patrick later told 60 Minutes he had a panic attack and was taken to an ambulance on his second day of testimony.",
  "trial-testimony",["patrick","evidence"],T("Patrick Clancy, Angela Krause, Saria Shelgren"),"Plymouth Superior Court","court",["wbur_0729","wcvb_0729","cbs_60min"])
E("t-responders","2026-07-30","day","First responders testify",
  "Ten first responders testified about the scene and lifesaving efforts; the defense cross-examined some about the appearance of her wounds, the cold and the darkness.",
  "trial-testimony",["evidence"],T("Duxbury police and fire"),"Plymouth Superior Court","court",["globe_0730"])
E("t-view","2026-07-31","day","Jury view of the home and the errand route",
  "Jurors were driven past the CVS and ThreeV and toured the Summer Street house (now owned by someone else) in small groups for about 40 minutes, including the basement and yard. Media were kept about 100 yards away. ER doctors and Det. Maffeo also testified.",
  "trial-testimony",["evidence"],F,"Duxbury (house and route)","overview",["nbc_view","globe_0731"])
E("t-journals","2026-08-03","day","Her journals read to the jury",
  "The prosecution read: \"I feel like I'm drowning every day.\" The defense read: \"I don't know what's wrong with me\" and \"I want help. I want to be well.\" Reddington argued the entries degraded to near-illegibility by January.",
  "trial-testimony",["evidence","lindsay"],F,"Plymouth Superior Court","court",["cbs_key","wcvb_0806","wiki"])
E("t-stip-speak","2026-08-04","day","Clancy speaks for the first time: forensic stipulation",
  "Asked by the judge whether she understood a stipulation on forensic facts (to avoid chain-of-custody witnesses), Clancy answered affirmatively, the first time she spoke at trial (via Wikipedia).",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["wiki"])
E("t-tox-nanny","2026-08-05","day","Toxicologist, DNA analyst, nanny, ICU nurses",
  "Toxicologist: levels not toxic. Former nanny Elaine Rossi described \"a wonderful mom\" who spoke about postpartum struggles. ICU nurses: she required resuscitation her first night and communicated by whiteboard from Jan. 28.",
  "trial-testimony",["evidence"],T("Dr. Justin Brower, Elaine Rossi, ICU nurses"),"Plymouth Superior Court","court",["wcvb_0806","eonline"])
E("t-me","2026-08-06","day","Medical examiner testifies (images shown to jury only)",
  "Dr. Kimberley Springer described findings consistent with ligature strangulation. By court order the images were shown only to jurors. Clancy wept; the defense did not cross-examine. A dispute followed over an alleged 'hot mic' remark, which the DA's office said was \"shut it off\" (about the screen).",
  "trial-testimony",["evidence"],T("Dr. Kimberley Springer"),"Plymouth Superior Court","court",["wcvb_0806","cbs_day9"])
E("t-mclean-tufts","2026-08-07","day","McLean psychiatrist and Dr. Tufts testify",
  "Goodheart: no signs of psychosis; low risk at discharge. Tufts (direct): Clancy answered no when asked about hearing voices; described treatment through Jan. 23.",
  "trial-testimony",["evidence"],T("Dr. Alia Goodheart / Dr. Jennifer Tufts"),"Plymouth Superior Court","court",["cbs_day9","pbs_mclean"])
E("t-tufts-cross","2026-08-10","day","Tufts cross-examined",
  "Tufts testified Clancy was \"completely denying any suicidal ideation or homicidal ideation\" the day before and disagreed that a medication increase pushed her \"over the edge.\" The defense criticized 25-minute video sessions and a lack of coordination among providers.",
  "trial-testimony",["evidence"],T("Dr. Jennifer Tufts"),"Plymouth Superior Court","court",["cbs_key","b25_mistrial"])
E("t-jollotta","2026-08-11","day","Nurse practitioner Rebecca Jollotta testifies",
  "Described adjusting medications with the Clancys in response to Patrick's concerns about side effects.",
  "trial-testimony",[],T("Rebecca Jollotta"),"Plymouth Superior Court","court",["cbs_key"])
E("t-phone","2026-08-13","day","State Police phone analysis",
  "Sgt. Timothy Chiappini testified to searches (\"hallucinations,\" \"psychosis,\" \"Can you treat a sociopath?\"), texts and the Oct. 2022 note, as well as everyday searches (a slime recipe, a Paw Patrol movie, a water park).",
  "trial-testimony",["evidence"],T("Sgt. Timothy Chiappini"),"Plymouth Superior Court","court",["globe_0813"])
E("t-whiffin-family","2026-08-17","day","Digital forensics; defense begins with family",
  "Ian Whiffin testified on phone/watch data. The defense called her mother, Paula Musgrove, and sister, Allison Ozga, who described her decline and suicidal statements.",
  "trial-testimony",["evidence","lindsay"],T("Ian Whiffin / Paula Musgrove / Allison Ozga"),"Plymouth Superior Court","court",["eonline","cbs_key"])
E("t-zeizel","2026-08-18","day","Defense: Zeizel, Condie, Laposata, Susan Clancy",
  "Zeizel (who met her about 60 times) said symptoms were consistent with psychosis and \"The medications were making things worse.\" Dr. Donald Condie called bipolar disorder a \"very serious possibility\" but acknowledged she did not report voices before the killings. A prosecution question to Susan Clancy about Catholic teaching was struck.",
  "trial-testimony",["lindsay"],T("Dr. Paul Zeizel, Dr. Donald Condie, Dr. Elizabeth Laposata, Susan Clancy"),"Plymouth Superior Court","court",["globe_0818"])
E("t-chaplain-rally","2026-08-20","day","Chaplain testifies; supporters rally outside",
  "Chaplain Cavanaugh testified (see Jan. 31, 2023). More than 400 supporters in pink gathered; the judge questioned each juror, and all said they could remain impartial. Other spectators, in white, said the focus should be on the children.",
  "trial-testimony",["lindsay"],T("Sheila Cavanaugh"),"Plymouth Superior Court","court",["globe_0820","b25_mistrial"])
E("t-resnick-mack","2026-08-21","day","Resnick for the defense; defense rests; Mack in rebuttal",
  "Resnick (by Zoom): \"She was clearly psychotic on that day.\" Prosecutors noted his writing that command hallucinations are easy to fake. Rebuttal psychiatrist Dr. Avram Mack said she \"retained the capacity\" for criminal responsibility and had depression and anxiety, with no evidence of mania.",
  "trial-testimony",["lindsay"],T("Dr. Phillip Resnick / Dr. Avram Mack"),"Plymouth Superior Court","court",["cbs_day18","cbs_key"],related=["d-voice-afternoon"])
E("t-heilbrun","2026-08-24","day","Heilbrun rebuttal; religion remark; mistrial motion denied",
  "Forensic psychologist Kirk Heilbrun said she was criminally responsible. After he referenced her Catholic upbringing, Reddington moved for a mistrial; it was denied and the judge told jurors to disregard the remark.",
  "trial-testimony",[],T("Dr. Kirk Heilbrun"),"Plymouth Superior Court","court",["cbs_key","guardian_0825"])
E("t-saathoff","2026-08-25","day","Heilbrun cross-examined; Saathoff testifies",
  "Heilbrun: \"She retained an awareness of the illegality of killing others, including her children.\" He said he was paid about $54,000 for 180 hours. Dr. Gregory Saathoff found it unusual that she had not reported voices before and that they ceased afterward, and cited inconsistencies in her account.",
  "trial-testimony",[],T("Dr. Kirk Heilbrun / Dr. Gregory Saathoff"),"Plymouth Superior Court","court",["guardian_0825"])
E("t-close","2026-08-27","day","Closing arguments; deliberations begin",
  "Reddington (52 min): \"My God, what does she have to do? She was reaching out for help and she was not getting it.\" Sprague (54 min): \"She knew what she did was wrong\"; the mental health system is \"not on trial here.\" Twelve of 18 jurors (nine women, three men) deliberated on options including first-degree murder, manslaughter and not guilty by reason of lack of criminal responsibility.",
  "trial-testimony",["evidence"],F,"Plymouth Superior Court","court",["cbs_key","wbur_mistrial","b25_mistrial"])
E("t-delib-exhibits","2026-08-28","day","Jury asks to see the knife and pill bottles",
  "On the second day of deliberations the jury asked to view the knife and bags of pill bottles.",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["nbcnews_delib","wiki"])
E("t-deadlock1","2026-09-01","day","First deadlock note",
  "The jury reported it could not reach a unanimous verdict; the judge sent it back. (A woman was later charged with intimidating jurors after allegedly filming them; via Wikipedia.)",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["wiki"])
E("t-tuey","2026-09-02","day","Tuey-Rodriguez charge given",
  "After a further deadlock report, the judge gave the Tuey-Rodriguez instruction urging jurors to keep trying for a verdict.",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["wbur_mistrial"])
E("t-holdout-note","2026-09-03","day","Foreperson's note about a lone juror",
  "The foreperson wrote that one juror \"has made statements acknowledging doubt, but refuses to apply it to the verdict as the law states.\" Reddington sought the juror's removal; the judge declined, saying a deliberating juror may be discharged only for reasons personal to that juror.",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["cnn_holdout","b25_mistrial"])
E("t-mistrial","2026-09-04T14:20"+EDT,"approximate","Mistrial declared",
  "A third note read: \"It is with a heavy heart that we report we are unable to come to a unanimous decision, and we will not be able to.\" The judge allowed one hour for an emergency petition; a Supreme Judicial Court single justice denied it, and the mistrial became official when court reconvened around 2:20 p.m. The split was 11-1 in favor of acquittal by reason of lack of criminal responsibility (per the defense and jurors). Juror names were sealed until Sept. 18.",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["wbur_mistrial","b25_mistrial","pbs_0929"],note="'Around 2:20 p.m.' court reconvened.")
E("t-reactions","2026-09-04T15:00"+EDT,"approximate","Reactions: DA, defense, Patrick's attorney",
  "DA Timothy Cruz said a retrial decision would come \"in the context of an official court proceeding\" and that first-degree charges were warranted. Reddington said the jurors were \"robbed by one man.\" Patrick's attorney: \"The prospect of reliving this tragedy through another trial is extraordinarily painful.\"",
  "media",["patrick"],F,"Outside Plymouth Superior Court","court",["b25_cruz","wbur_mistrial","b25_mistrial"],note="Afternoon; minute approximate.")

# ---------------- POST-TRIAL ----------------
E("p-jurors-tv","2026-09-08","day","Jurors describe deliberations on NBC10",
  "Foreperson Ronni Carlson (spelled Roni by CNN) said the holdout \"admitted he had reasonable doubt\" but would not vote for the insanity verdict; other jurors criticized him and the prosecution's tone. These are jurors' accounts; the holdout disputes them.",
  "media",[],T("jurors (NBC10 interview)"),"Media","offsite",["pbs_jurors","cnn_holdout"],related=["p-holdout"])
E("p-impound","2026-09-14","day","Juror list impounded indefinitely",
  "The judge ordered the names of jurors and the jury pool kept from the public indefinitely for juror safety after the holdout's identity circulated online.",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["cbs_0929","wiki"])
E("p-holdout","2026-09-17","day","Holdout juror's statement: 'I didn't have any doubts'",
  "Through counsel, the holdout said he was repeatedly cut off and misperceived: \"I didn't have any doubts,\" believing the evidence showed she \"knew exactly what she was doing and planned.\" (This site does not name private jurors.)",
  "media",[],T("holdout juror (written statement)"),"Media","offsite",["cnn_holdout","cbs_holdout"])
E("p-60min","2026-09-20","day","60 Minutes interview with Patrick Clancy",
  "Patrick and his wife spoke with Ross Douthat. \"I think mental illness has this ability to be tragically deceptive,\" he said, and he believes he \"did the best I could with what I had at the time.\" He described being targeted by online theories.",
  "media",["patrick"],T("Patrick Clancy (60 Minutes)"),"Media","offsite",["cbs_60min","cbs_60min_tx","cbs_60min_5"])
E("p-motions","2026-09-20","approximate","Defense motions: dismiss (double jeopardy), probe juror, required finding",
  "The defense filed motions arguing the mistrial was improperly declared and a retrial would violate double jeopardy; seeking an inquiry into the holdout's questionnaire answers, statements and phone use; and seeking a required finding of not guilty.",
  "legal",["lindsay"],D,"Plymouth Superior Court","court",["pbs_0929","wcvb_preview","cbs_0928"],note="Filed in the weeks after the mistrial; exact dates not in cited sources.")
E("p-gag","2026-09-28","day","Prosecution seeks gag order; juror-probe motion adjourned by consent",
  "Prosecutors moved to bar prejudicial out-of-court statements, citing defense press comments; WBZ-TV and the Globe opposed. The juror's counsel said both sides agreed to adjourn the juror-inquiry motion.",
  "legal",[],P,"Plymouth Superior Court","court",["cbs_0929","fox_0929"])
E("p-hearing","2026-09-29T09:55"+EDT,"exact","Sept. 29 status hearing: no retrial decision; next date Nov. 2",
  "The hearing began at 9:55 a.m. and ran about an hour. The juror-inquiry motion, the motion to dismiss and the gag order were set for Nov. 2; motions for a required finding and to unseal juror notes/sidebars were taken under advisement. The judge wanted a tentative trial date (\"get this thing tried as soon as possible\"); both sides preferred to await rulings; Reddington said he could not try the case before June.",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["cbs_0929","bbc_0929"])
E("p-hearing-def","2026-09-29T10:20"+EDT,"approximate","Defense argues insufficient evidence she killed the children",
  "Reddington argued police \"just immediately assumed\" she was guilty and \"There's no evidence that she admitted she did this,\" saying she has no memory and was told what happened by police. This departs from the trial, where he did not dispute that she killed them.",
  "legal",["lindsay"],D,"Plymouth Superior Court","court",["cbs_0929","bbc_0929"],related=["p-hearing-pros"])
E("p-hearing-pros","2026-09-29T10:35"+EDT,"approximate","Prosecution: the evidence is 'voluminous'",
  "ADA Shanan Buckingham called the insufficiency argument \"laughable,\" said the Commonwealth \"met its burden,\" and argued \"not every defendant with a mental illness lacks criminal responsibility.\"",
  "legal",[],P,"Plymouth Superior Court","court",["cbs_0929","bbc_0929"])
E("p-da","2026-09-29T11:45"+EDT,"approximate","DA: no decision yet on retrial",
  "Cruz said his office has not decided and is proceeding as if a second trial is imminent: \"We're doing a very thorough review right now.\"",
  "legal",["evidence"],F,"Outside Plymouth Superior Court","court",["cbs_0929","bbc_0929"])
E("p-nov2","2026-11-02","day","Scheduled: Nov. 2 hearing",
  "Scheduled hearing on the defense motion to dismiss, the juror-inquiry motion, the gag order and trial scheduling. Future event; outcome unknown.",
  "legal",["evidence"],F,"Plymouth Superior Court","court",["cbs_0929","bbc_0929"])

# ---------------- SCENE PATHS ----------------
SCENE = {
 "lindsay": ["d-snowman","d-voice-afternoon","d-text-takeout","d-patrick-leaves","d-voice-loud","d-basement-account","d-call-534","d-def-phone","d-wounds-def","d-screen-def","d-jump","d-yard-def","a-chaplain","a-zeizel-call","t-open-def","t-mistrial","p-hearing-def"],
 "patrick": ["d-best-day","d-text-takeout","d-patrick-leaves","d-cvs","d-call-534","d-cvs-leave","d-threev","d-home","d-locked","d-yard","d-911","d-basement","d-patrick-distress","a-cause","a-zeizel-call","t-patrick-2","p-60min"],
 "evidence": ["d-snowman","d-search-miralax","d-search-threev","d-cvs-call","d-text-takeout","d-threev-call","d-last-unlock","d-patrick-leaves","d-watch-stops","d-cvs","d-call-533","d-call-534","d-stairs","d-phone-stops","d-threev","d-bedroom-evidence","d-screen","d-jump","d-home","d-911","d-responders","d-basement","d-transport","d-dawson-728","t-mistrial","p-hearing"],
}

def M(id,type,title,outlet,date,url,description,events):
    return dict(id=id,type=type,title=title,outlet=outlet,date=date,url=url,description=description,events=events)
MEDIA = [
 M("m-open-globe","trial video","Opening statements (prosecution and defense), full video","The Boston Globe","2026-07-27",S["globe_open"][1],"Globe page embedding the full opening statements by ADA Shanan Buckingham and defense attorney Kevin Reddington.",["t-open-pros","t-open-def"]),
 M("m-open-wcvb","trial video","Opening statements and Patrick Clancy's day-1 testimony (video segments)","WCVB","2026-07-27",S["wcvb_0727"][1],"Article with embedded videos of both openings and analysis.",["t-open-pros","t-open-def","t-patrick-1"]),
 M("m-911-coverage","audio coverage","911 call played in court (coverage; audio not publicly released)","WBUR","2026-07-29",S["wbur_0729"][1],"Reporting on the seven-minute 911 call played for jurors. The recording itself was barred from public release by court order.",["d-911","t-patrick-2"]),
 M("m-911-ruling","court ruling coverage","Judge bars public release of 911 audio and autopsy photos","The Boston Globe","2026-07-24",S["globe_911rule"][1],"Coverage of the July 24, 2026 ruling granting Patrick Clancy's motion.",["a-911-ruling"]),
 M("m-patrick-day2","trial video","Patrick Clancy cross-examination; courtroom reaction to 911 call (video segments)","WCVB","2026-07-29",S["wcvb_0729"][1],"Article with courtroom video clips (the 911 audio itself is not included).",["t-patrick-2","d-911"]),
 M("m-view-courttv","trial video","Lindsay Clancy Jury Views Home Where Children Died","Court TV (videonest)","2026-07-31","https://courttv.videonest.co/videos/2046547/lindsay-clancy-jury-views-home-where-children-died-k7x_542ARX","Court TV coverage of the jury view (media were kept away from the house).",["t-view"]),
 M("m-closing-courttv","trial video","MA v. Lindsay Clancy: Full Closing Arguments","Court TV (YouTube)","2026-08-27","https://www.youtube.com/watch?v=dtpw_U4Pqrg","Full closing arguments by Kevin Reddington and ADA Jennifer Sprague. Contains verbal descriptions of the killings.",["t-close"]),
 M("m-closing-nbc","trial video","Day 22: Closing arguments & deliberations (livestream)","NBC News (YouTube)","2026-08-27","https://www.youtube.com/watch?v=N92eTlcQOVw","NBC News livestream of day 22.",["t-close"]),
 M("m-voice-courttv","trial video","Male Voice Told Lindsay Clancy to Kill?","Court TV (videonest)","2026-08","https://courttv.videonest.co/videos/2086444/male-voice-told-lindsay-clancy-to-kill-MrZekdGMbu","Court TV segment on testimony about the voice she reported.",["t-zeizel","a-zeizel-call"]),
 M("m-texts","messages quoted in court","Final texts and phone data read in court","E! News","2026-08-17",S["eonline"][1],"Compiles the Jan. 24 text exchange read by Sgt. Chiappini and Ian Whiffin's phone/Apple Watch testimony.",["d-text-takeout","d-order-choices","d-last-unlock","d-stairs"]),
 M("m-searches","messages quoted in court","Searches, notes and texts to her mother (testimony coverage)","The Boston Globe","2026-08-13",S["globe_0813"][1],"Chiappini's testimony: searches, the Oct. 25, 2022 phone note, texts with her mother.",["t-phone","mh-phone-note","mh-texts-mother","mh-search-hallu"]),
 M("m-journal","documents quoted in court","Journal and note excerpts read to jurors","CBS News","2026-08-27",S["cbs_key"][1],"Key-moments roundup quoting journal entries, testimony and closings.",["t-journals","mh-journal-nov"]),
 M("m-meds","documents / data","Timeline of prescriptions (Globe review of court records)","The Boston Globe","2026-07-27",S["globe_meds"][1],"More than 30 prescriptions / 13 psychiatric medications, Sept. 2022 to Jan. 2023.",["mh-seroquel","t-open-def"]),
 M("m-complaint","court filing","Lindsay Clancy civil complaint (PDF)","WPRI (hosted court filing)","2026-01-23",S["complaint_pdf"][1],"Malpractice complaint eFiled Jan. 22, 2026 in Norfolk Superior Court. Contains unproven allegations and describes the killings from her perspective.",["a-civil","d-voice-loud","d-basement-account","mh-voice-complaint"]),
 M("m-da-release","official document","Plymouth County DA press release on Superior Court arraignment","Plymouth County District Attorney's Office","2023-10-26",S["da_1026"][1],"Official summary: 911 time, charges, cause-of-death findings.",["a-sc-arraign","a-indict","d-911"]),
 M("m-arraign","court proceeding coverage","Arraignment: prosecutors' minute-by-minute timeline","NBC10 Boston","2023-02-07",S["nbc_arraign"][1],"Prosecution timeline presented Feb. 7, 2023 (includes embedded video).",["a-arraign"]),
 M("m-mistrial","court proceeding coverage","Mistrial declared","WBUR","2026-09-04",S["wbur_mistrial"][1],"Full account of deliberations, jury notes and the mistrial.",["t-mistrial"]),
 M("m-jurors","interview coverage","Jurors speak out (NBC10 interview, via AP)","PBS News / AP","2026-09-09",S["pbs_jurors"][1],"Foreperson and jurors describe deliberations.",["p-jurors-tv"]),
 M("m-holdout","statement coverage","Holdout juror's statement; Patrick Clancy speaks out","CNN","2026-09-17",S["cnn_holdout"][1],"Holdout's written statement through counsel.",["p-holdout"]),
 M("m-60min","interview","60 Minutes: Patrick Clancy interview","CBS News / 60 Minutes","2026-09-20",S["cbs_60min"][1],"Article and video from the interview with Ross Douthat.",["p-60min"]),
 M("m-60min-tx","interview transcript","60 Minutes transcript: Patrick Clancy","CBS News","2026-09-20",S["cbs_60min_tx"][1],"Full transcript.",["p-60min"]),
 M("m-0929-cbs","hearing coverage / livestream","Sept. 29 hearing live updates and stream","CBS Boston","2026-09-29",S["cbs_0929"][1],"Minute-by-minute coverage of the status hearing.",["p-hearing","p-hearing-def","p-hearing-pros","p-da"]),
 M("m-0929-bbc","hearing coverage / livestream","Sept. 29 hearing live page","BBC News","2026-09-29",S["bbc_0929"][1],"Live reporting and video of the hearing.",["p-hearing"]),
 M("m-wiki","reference","Killing of the Clancy children (overview)","Wikipedia","accessed 2026-09-29",S["wiki"][1],"Encyclopedic overview with extensive citations; used for cross-checking.",[]),
]

NOT_PUBLIC = [
 "The 911 recording (played in court; public release barred by the July 24, 2026 order).",
 "Autopsy photographs (shown to jurors only; impounded).",
 "The Feb. 2023 hospital phone call between Lindsay and Patrick Clancy is known only through testimony; no recording was found publicly.",
 "Crime-scene photos and physical exhibits (bands, clothing, knife, pill bottles): not released as a public set; this site intentionally links to none.",
 "Juror notes and sidebar transcripts: impounded; a defense motion to release them was taken under advisement on Sept. 29, 2026.",
 "Official floor plans of the house: not public. The 3D model is an approximation.",
 "The defense's window-fall animation mentioned in court: no public copy found.",
]

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ids = [e["id"] for e in EV]
assert len(ids)==len(set(ids)), "dup ids"
ids=set(ids)
for k,v in SCENE.items():
    for i in v: assert i in ids, (k,i)
for m in MEDIA:
    for i in m["events"]: assert i in ids, (m["id"], i)
for e in EV:
    for r in e["related"]: assert r in ids, (e["id"], r)
    assert e["status"] in ("established fact","prosecution claim","defense claim") or e["status"].startswith("testimony by "), e["id"]
    for p in e["pov"]: assert p in ("lindsay","patrick","evidence")
# link media to events
for e in EV:
    e["media"] = [m["id"] for m in MEDIA if e["id"] in m["events"]]
EV.sort(key=lambda e: (e["datetime"][:16], e["id"]))
meta = {"generated":"2026-09-29","timezoneNote":"Times are local to Massachusetts (Eastern Time: EST, UTC-5, in January; EDT, UTC-4, in summer).","eventCount":len(EV)}
json.dump({"meta":meta,"events":EV,"scenePaths":SCENE}, open(os.path.join(root,"data","events.json"),"w"), indent=1, ensure_ascii=False)
json.dump({"media":MEDIA,"notPublic":NOT_PUBLIC}, open(os.path.join(root,"data","media.json"),"w"), indent=1, ensure_ascii=False)
with open(os.path.join(root,"js","data.js"),"w") as f:
    f.write("// Generated by tools/build_data.py from data/events.json + data/media.json (lets the site run from file:// without fetch).\n")
    f.write("window.CASE_DATA = "+json.dumps({"meta":meta,"events":EV,"scenePaths":SCENE},ensure_ascii=False)+";\n")
    f.write("window.MEDIA_DATA = "+json.dumps({"media":MEDIA,"notPublic":NOT_PUBLIC},ensure_ascii=False)+";\n")
srcs=set()
for e in EV:
    for s in e["sources"]: srcs.add(s["url"])
used_ev=len(srcs)
for m in MEDIA: srcs.add(m["url"])
from collections import Counter
print("events",len(EV),"| unique source URLs cited by events",used_ev,"| incl. media",len(srcs))
print(Counter(e["category"] for e in EV)); print(Counter(e["status"] if not e["status"].startswith("testimony") else "testimony" for e in EV))
